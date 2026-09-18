import os
import json
import time

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    HTTPException,
    Header
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, EmailStr

from google import genai

from database import (
    users_collection,
    advisories_collection,
    initialize_database
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_access_token
)


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured in .env"
    )


# ============================================================
# GEMINI
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)

GEMINI_MODEL = "gemini-3.6-flash"


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="CropCare AI API",
    description="AI-powered crop advisory chatbot",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# LOAD CROPS
# ============================================================

with open(
    "crops.json",
    "r",
    encoding="utf-8"
) as file:

    crops_data = json.load(file)


# ============================================================
# DATABASE STARTUP
# ============================================================

@app.on_event("startup")
def startup_event():

    initialize_database()


# ============================================================
# MODELS
# ============================================================

class ChatRequest(BaseModel):

    crop: str
    question: str


class RegisterRequest(BaseModel):

    email: EmailStr
    password: str


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message":
        "CropCare AI backend is running successfully."
    }


# ============================================================
# CROPS
# ============================================================

@app.get("/crops")
def get_crops():

    return {
        "crops": list(crops_data.keys())
    }


# ============================================================
# AUTHENTICATION HELPER
# ============================================================

def get_current_user(
    authorization: str | None
):

    if not authorization:

        raise HTTPException(
            status_code=401,
            detail="Authentication required."
        )


    if not authorization.startswith("Bearer "):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication format."
        )


    token = authorization.replace(
        "Bearer ",
        "",
        1
    ).strip()


    email = verify_access_token(token)


    if not email:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )


    user = users_collection.find_one(
        {
            "email": email
        }
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )


    return user


# ============================================================
# REGISTER
# ============================================================

@app.post("/register")
def register(
    request: RegisterRequest
):

    email = str(
        request.email
    ).strip().lower()

    password = request.password


    if len(password) < 6:

        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters."
        )


    existing_user = users_collection.find_one(
        {
            "email": email
        }
    )


    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )


    password_hash = hash_password(
        password
    )


    user_document = {

        "email": email,

        "password_hash": password_hash,

        "created_at": time.time()
    }


    try:

        result = users_collection.insert_one(
            user_document
        )

    except Exception as error:

        if "duplicate key" in str(error).lower():

            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists."
            )

        raise


    token = create_access_token(
        email
    )


    return {

        "success": True,

        "message":
        "Account created successfully.",

        "access_token": token,

        "user": {

            "id":
            str(result.inserted_id),

            "email":
            email
        }
    }


# ============================================================
# LOGIN
# ============================================================

@app.post("/login")
def login(
    request: LoginRequest
):

    email = str(
        request.email
    ).strip().lower()


    user = users_collection.find_one(
        {
            "email": email
        }
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    password_valid = verify_password(

        request.password,

        user["password_hash"]
    )


    if not password_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )


    token = create_access_token(
        email
    )


    return {

        "success": True,

        "message":
        "Login successful.",

        "access_token":
        token,

        "user": {

            "id":
            str(user["_id"]),

            "email":
            user["email"]
        }
    }


# ============================================================
# CURRENT USER
# ============================================================

@app.get("/me")
def get_me(
    authorization: str | None = Header(
        default=None
    )
):

    user = get_current_user(
        authorization
    )


    advisory_count = advisories_collection.count_documents(
        {
            "user_id":
            str(user["_id"])
        }
    )


    return {

        "success": True,

        "user": {

            "id":
            str(user["_id"]),

            "email":
            user["email"],

            "created_at":
            user.get("created_at")
        },

        "stats": {

            "advisories":
            advisory_count,

            "crops":
            len(crops_data)
        }
    }


# ============================================================
# GEMINI RESPONSE
# ============================================================

def generate_gemini_response(
    prompt: str
):

    max_attempts = 3


    for attempt in range(
        1,
        max_attempts + 1
    ):

        try:

            print()
            print("=" * 60)
            print(
                f"GEMINI ATTEMPT {attempt}/{max_attempts}"
            )
            print("=" * 60)


            response = client.models.generate_content(

                model=GEMINI_MODEL,

                contents=prompt
            )


            return response.text


        except Exception as error:

            error_text = str(
                error
            )


            temporary_error = (

                "503" in error_text

                or
                "UNAVAILABLE" in error_text

                or
                "429" in error_text

                or
                "RESOURCE_EXHAUSTED" in error_text
            )


            if (
                temporary_error
                and
                attempt < max_attempts
            ):

                wait_time = 2 ** attempt

                print(
                    f"Gemini temporarily unavailable."
                )

                print(
                    f"Retrying in {wait_time} seconds..."
                )

                time.sleep(
                    wait_time
                )

                continue


            raise error


    raise RuntimeError(
        "Gemini could not generate a response."
    )


# ============================================================
# CHAT
# ============================================================

@app.post("/chat")
def chat(

    request: ChatRequest,

    authorization: str | None = Header(
        default=None
    )
):

    # --------------------------------------------------------
    # AUTHENTICATION
    # --------------------------------------------------------

    user = get_current_user(
        authorization
    )


    # --------------------------------------------------------
    # INPUT
    # --------------------------------------------------------

    crop = request.crop.lower().strip()

    question = request.question.strip()


    if crop not in crops_data:

        raise HTTPException(
            status_code=400,
            detail="Selected crop is not available."
        )


    if not question:

        raise HTTPException(
            status_code=400,
            detail="Please enter a crop-related question."
        )


    # --------------------------------------------------------
    # CROP INFORMATION
    # --------------------------------------------------------

    crop_info = crops_data[crop]


    # --------------------------------------------------------
    # GEMINI PROMPT
    # --------------------------------------------------------

    prompt = f"""
You are CropCare AI, an AI-powered agricultural
advisory assistant designed to provide simple,
practical and sustainable crop-management guidance
for Indian farmers.

Selected crop:
{crop_info["name"]}

Crop information:

- Season: {crop_info["season"]}
- Suitable soil: {crop_info["soil"]}
- Water requirement: {crop_info["water"]}
- Fertilizer guidance: {crop_info["fertilizer"]}
- Common diseases: {", ".join(crop_info["common_diseases"])}
- Common pests: {", ".join(crop_info["common_pests"])}
- Sustainable practices:
{", ".join(crop_info["sustainable_practices"])}

Farmer's question:
{question}

Instructions:

1. Answer only in the context of the selected crop.

2. Use simple, farmer-friendly English.

3. Give practical and actionable guidance.

4. Prefer sustainable agricultural practices.

5. Do not recommend unnecessary pesticides,
fertilizers or excessive irrigation.

6. Do not invent exact pesticide doses,
fertilizer doses or chemical application schedules
when local information is unavailable.

7. Do not claim that a disease or pest is definitely
present based only on a text description.

8. Serious crop damage, unusual symptoms or severe
pest infestation should be referred to a qualified
agricultural expert or local agricultural extension officer.

9. Keep the answer concise but useful.

Use Markdown.

Use these sections when appropriate:

### CropCare - advice

### Key Points

### Practical Steps

### Sustainable Practice

### Important Note
"""


    # --------------------------------------------------------
    # GENERATE RESPONSE
    # --------------------------------------------------------

    try:

        answer = generate_gemini_response(
            prompt
        )

    except Exception as error:

        print()
        print("=" * 60)
        print("FINAL GEMINI FAILURE")
        print("=" * 60)
        print(type(error).__name__)
        print(str(error))
        print("=" * 60)


        raise HTTPException(

            status_code=503,

            detail=
            "The AI service is temporarily unavailable. "
            "Please try again in a few seconds."
        )


    # --------------------------------------------------------
    # SAVE ADVISORY HISTORY
    # --------------------------------------------------------

    advisory_document = {

        "user_id":
        str(user["_id"]),

        "user_email":
        user["email"],

        "crop":
        crop_info["name"],

        "question":
        question,

        "answer":
        answer,

        "created_at":
        time.time()
    }


    advisories_collection.insert_one(
        advisory_document
    )


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "answer":
        answer
    }


# ============================================================
# ADVISORY HISTORY
# ============================================================

@app.get("/history")
def get_history(

    authorization: str | None = Header(
        default=None
    )
):

    user = get_current_user(
        authorization
    )


    records = advisories_collection.find(
        {
            "user_id":
            str(user["_id"])
        }
    ).sort(
        "created_at",
        -1
    ).limit(10)


    history = []


    for record in records:

        history.append({

            "id":
            str(record["_id"]),

            "crop":
            record["crop"],

            "question":
            record["question"],

            "answer":
            record["answer"],

            "created_at":
            record["created_at"]
        })


    return {

        "success": True,

        "history":
        history
    }
