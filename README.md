# 🌾 CropCare AI

### AI-Powered Crop Advisory Chatbot for Sustainable Agriculture

CropCare AI is an AI-powered crop advisory chatbot designed to provide farmers with accessible and timely crop-management guidance.

The application allows authenticated users to select a crop and ask questions related to **irrigation, diseases, pests, fertilizers, and sustainable farming practices**. The system uses Google's **Gemini API** to generate farmer-friendly responses and **MongoDB Atlas** to securely store user accounts and advisory history.

---

## 📌 Problem Statement

> **How might we use AI to provide farmers with accessible and timely crop-management guidance so that they can make better-informed agricultural decisions and promote more sustainable farming practices?**

---

## 🎯 Project Objective

The objective of CropCare AI is to create a simple digital agricultural advisory platform that can:

* 🌾 Provide crop-specific agricultural guidance.
* 📚 Make crop-management information easier to access.
* 💧 Help users understand irrigation requirements.
* 🦠 Provide information about common crop diseases and pests.
* 🌱 Suggest responsible fertilizer and resource-management practices.
* ♻️ Encourage sustainable agricultural practices.
* 💬 Maintain a history of previous crop-related questions and AI responses.

---

## ✨ Key Features

### 🤖 AI-Powered Crop Advisory

Users can ask natural-language questions about their selected crop and receive AI-generated agricultural guidance.

**Example questions:**

* How often should I irrigate rice?
* What are the common diseases in wheat?
* How can I manage pests sustainably?
* What fertilizer practices should I follow for maize?

---

### 🌾 Multiple Crop Support

CropCare AI currently supports the following crops:

1. Rice
2. Wheat
3. Maize
4. Chickpea
5. Mustard
6. Sugarcane
7. Groundnut
8. Cotton
9. Potato
10. Tomato

---

### 🔐 User Authentication

The application provides:

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected advisory endpoints
* Logout functionality

---

### 💬 Advisory History

Authenticated users can view their recent crop advisories.

The system stores:

* Selected crop
* User question
* AI-generated answer
* User ID
* Timestamp

---

### 📊 User Dashboard

The dashboard provides:

* Total advisory count
* Number of available crops
* AI assistant status
* Recent advisory history
* Quick access to the Crop Advisor
* Sustainable agriculture information

---

### 🌱 Sustainable Farming Focus

The chatbot prompt is designed to encourage responsible agricultural practices, including:

* Efficient water usage
* Responsible fertilizer usage
* Integrated pest-management concepts
* Soil-health awareness
* Environmentally responsible farming

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      CropCare AI     │
                    │       Frontend       │
                    │      React + Vite    │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │       Python         │
                    └───────┬───────┬──────┘
                            │       │
                ┌───────────┘       └────────────┐
                ▼                                ▼
       ┌─────────────────┐              ┌─────────────────┐
       │   Gemini API    │              │  MongoDB Atlas  │
       │  AI Generation  │              │ Users + History │
       └─────────────────┘              └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Axios
* React Router
* React Markdown
* Remark GFM
* CSS

### Backend

* Python
* FastAPI
* Uvicorn
* PyMongo
* Python-JOSE
* Passlib
* Bcrypt
* Python-dotenv

### Artificial Intelligence

* Google Gemini API
* Gemini Flash Model

### Database

* MongoDB Atlas

### Authentication

* JWT
* Bcrypt Password Hashing

---

## 📁 Project Structure

```text
AI-Crop-Advisory-Chatbot/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── auth.py
│   ├── crops.json
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── cropcare-hero.jpg
│   │       └── dashboard/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Dashboard.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

> **Note:** The `.env` file contains private credentials and must **never** be committed to GitHub. Only `.env.example` should be included in the repository.

---

# 🚀 Getting Started

Follow the steps below to run CropCare AI locally.

## 1. Clone the Repository

```bash
git clone https://github.com/Disha-1012/AI-Crop-Advisory-Chatbot.git
```

Move into the project directory:

```bash
cd AI-Crop-Advisory-Chatbot
```

---

# ⚙️ Backend Setup

## 2. Open the Backend Folder

```bash
cd backend
```

---

## 3. Create a Virtual Environment

### Windows

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

After activation, your terminal should look similar to:

```text
(venv) C:\Projects\AI-Crop-Advisory-Chatbot\backend>
```

---

## 4. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Configure Environment Variables

Create a file named:

```text
.env
```

inside the `backend` directory.

Copy the structure from:

```text
.env.example
```

The required environment variables are:

```env
GEMINI_API_KEY=your_gemini_api_key_here

MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority

MONGODB_DATABASE=cropcare_db

SECRET_KEY=your_long_random_secret_key
```

### ⚠️ Security Warning

Never publish your actual:

* Gemini API key
* MongoDB connection string
* Database password
* JWT secret key

to GitHub.

---

## 6. Start the Backend

From the `backend` directory, run:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

## 7. Open a New Terminal

Keep the backend terminal running.

Open another terminal and navigate to the frontend directory:

```bash
cd AI-Crop-Advisory-Chatbot/frontend
```

---

## 8. Install Frontend Dependencies

```bash
npm install
```

---

## 9. Start the Frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser to access CropCare AI.

---

# 🔑 Authentication Flow

```text
                       User
                        │
                        ▼
                    Register
                        │
                        ▼
             Password hashed using bcrypt
                        │
                        ▼
                  MongoDB Atlas
                        │
                        ▼
                    JWT Token
                        │
                        ▼
             Authenticated Dashboard
```

For protected API requests, the application uses:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 💬 Crop Advisory Flow

```text
                  User selects crop
                         │
                         ▼
                   User asks question
                         │
                         ▼
                   React Frontend
                         │
                         ▼
                  FastAPI /chat
                         │
                         ▼
                JWT Authentication
                         │
                         ▼
                    Gemini API
                         │
                         ▼
             AI-generated crop guidance
                         │
                         ├───────────────► MongoDB Atlas
                         │                  stores advisory
                         ▼
                  React displays
                     response
```

---

# 🗄️ Database Structure

CropCare AI uses **MongoDB Atlas** as its database.

The application uses the following collections:

```text
cropcare_db
│
├── users
│
└── advisories
```

## Users Collection

The `users` collection stores information such as:

```text
_id
email
hashed_password
created_at
```

## Advisories Collection

The `advisories` collection stores:

```text
_id
user_id
crop
question
answer
created_at
```

The application initializes the required database indexes automatically.

---

# 🌱 Supported Advisory Areas

CropCare AI is designed to answer questions related to the following areas.

### 💧 Irrigation

* Water requirements
* Irrigation practices
* Water conservation
* Efficient water usage

### 🦠 Crop Diseases

* Common crop diseases
* General symptoms
* General management practices

### 🐛 Pest Management

* Common pests
* Prevention strategies
* Sustainable pest-management approaches
* Integrated pest-management concepts

### 🧪 Fertilizers

* General nutrient management
* Responsible fertilizer use
* Soil-health considerations
* Sustainable input management

### 🌍 Sustainable Farming

* Water conservation
* Responsible agricultural inputs
* Soil-health awareness
* Environmentally responsible practices
* Resource-efficient farming

---

# ⚠️ Important Disclaimer

> **CropCare AI provides general AI-generated agricultural guidance for educational and informational purposes.**

The responses generated by the application should **not** be considered a replacement for professional agricultural advice, laboratory diagnosis, or local agricultural extension services.

For serious crop damage, unusual symptoms, severe pest outbreaks, or decisions involving significant financial or agricultural risk, users should consult qualified agricultural experts or local agricultural extension officers.

---

# 🌍 Sustainability Focus

CropCare AI focuses on supporting more informed and responsible agricultural decision-making.

The project particularly emphasizes:

* 💧 Efficient resource use
* 💦 Water awareness and conservation
* 🧪 Responsible agricultural inputs
* 🐛 Sustainable pest management
* 🌱 Soil-health awareness
* 📱 Accessible digital agricultural guidance

The project aims to demonstrate how AI and modern web technologies can be used to make agricultural information more accessible while encouraging sustainable farming practices.

---

# 🔮 Future Improvements

Potential future improvements include:

* 🌐 Regional language support
* 🎙️ Voice-based farmer interaction
* 🌦️ Weather-aware recommendations
* 📍 Soil and location-based advisory
* 📷 Crop disease image analysis
* 🌾 Support for additional crop varieties
* 📡 Offline or low-connectivity support
* 🏛️ Government agricultural information integration
* 👨‍🌾 More detailed farmer profiles
* 📋 Personalized crop-management plans
* 📊 Advanced advisory analytics

---

# 🎓 Project Purpose

**CropCare AI — AI-Powered Crop Advisory Chatbot**

This project was developed as an academic and technology initiative focused on:

* Artificial Intelligence
* Sustainable Agriculture
* Web Development
* Digital Agricultural Advisory Systems
* Responsible Resource Management
* Accessible Technology

---

# 👩‍💻 Author

**Disha Dutta**

Information Technology
MCKV Institute of Engineering

---

## ⭐ Acknowledgement

CropCare AI demonstrates the potential of combining **Artificial Intelligence, web technologies, cloud databases, and sustainable agriculture concepts** to build accessible digital solutions for real-world problems.

---

## 📄 License

This project is intended for **academic, educational, and demonstration purposes**.