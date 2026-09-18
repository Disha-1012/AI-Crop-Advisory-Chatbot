import os

from dotenv import load_dotenv
from google import genai


# Load .env
load_dotenv()


# Get API key
api_key = os.getenv("GEMINI_API_KEY")


print("=" * 60)
print("GEMINI API TEST")
print("=" * 60)


if not api_key:

    print("ERROR: GEMINI_API_KEY was not found.")
    exit()


print("API key found successfully.")
print("API key length:", len(api_key))


# Create Gemini client
client = genai.Client(
    api_key=api_key
)


print("\nSending test request to Gemini...")


try:

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Say hello in one short sentence."
    )


    print("\nGemini response:")
    print(response.text)

    print("\n" + "=" * 60)
    print("SUCCESS: Gemini API is working.")
    print("=" * 60)


except Exception as error:

    print("\n" + "=" * 60)
    print("GEMINI API ERROR")
    print("=" * 60)

    print(type(error).__name__)
    print(str(error))

    print("=" * 60)