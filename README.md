# 🤖 IntelliReview - AI Code Reviewer

IntelliReview is a full-stack, production-grade application that leverages Google's Gemini API to provide automated, high-quality code reviews. It includes two specialized review modes: **Beginner Mode** (focused on clear, constructive learning feedback) and **Interview Mode** (focused on performance, complexity analysis, and strict evaluations).

---

## 🗂️ Project Structure

This project is organized as a monorepo containing both the frontend client and the backend server:

```text
├── api/                  # Vercel serverless entrypoint for production API routing
├── backend/              # Node.js/Express backend server
│   ├── src/
│   │   ├── config/       # Database connection setup
│   │   ├── controllers/  # Route logic (auth, reviews)
│   │   ├── middleware/   # Authentication, rate-limiting, and error-handlers
│   │   ├── models/       # Mongoose schemas (User, Review)
│   │   ├── routes/       # Express route endpoints
│   │   ├── services/     # Gemini API integration & prompt engineering
│   │   └── utils/        # Error handlers and async utilities
│   └── package.json
├── frontend/             # Vite + React + Tailwind CSS client
│   ├── src/
│   │   ├── api/          # Axios configuration with auth interceptors
│   │   ├── components/   # Reusable UI components (Editor, Sidebar, Tabs)
│   │   ├── context/      # Authentication context
│   │   ├── pages/        # Dashboard, Login, Signup, New Review, Profile
│   │   └── index.css     # Global styles & tailwind configuration
│   └── package.json
├── package.json          # Root package.json managing workspace settings
└── vercel.json           # Vercel deployment configuration
```

---

## 🚀 Features

- **🔐 Robust Auth**: JWT Authentication with login/signup flow and secure client-side storage.
- **🤖 Gemini AI Integration**: Custom prompt engineering with multi-language parsing (C++, Java, Python, JavaScript).
- **⏱️ Dynamic Dual Modes**: Mode-specific review generation:
  - **Beginner**: Simpler explanations, readability tips, and standard code styling.
  - **Interview**: Time/Space complexity (Big O notation), optimization, and interview-grade bug detection.
- **📊 History Dashboard**: Track past reviews, sort by date, and delete old review sessions.
- **🛡️ Security Middleware**: Helmet headers, Express Rate Limiter, and bcryptjs password hashing.

---

## 💻 Local Development Setup

To run the application locally, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)
- Google Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/))

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` folder using [backend/.env.example](file:///c:/Users/visha\OneDrive\Desktop\ai-code-reviewer\backend\.env.example) as a reference:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run the Applications

You can start both the frontend and backend services simultaneously from the root folder:

#### Install all dependencies (Uses npm workspaces):
```bash
npm install
```

#### Run Backend (Dev mode with nodemon):
```bash
npm run dev --workspace=backend
```

#### Run Frontend (Vite server):
```bash
npm run dev --workspace=frontend
```

Open `http://localhost:5173` in your browser to view the application.

---

## ☁️ Production Deployment (Vercel)

This repository is optimized for one-click deployment on **Vercel** as a single application.

1. Create a **New Project** on Vercel and import this repository.
2. Select **Web Application** or **Other** as the **Application Preset** (Vercel will read the `vercel.json` and build the frontend output into `frontend/dist`).
3. Add the following **Environment Variables** in Vercel:
   - `MONGO_URI`: *Your MongoDB connection string*
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
   - `JWT_SECRET`: *A secure random string*
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
4. Click **Deploy**. Vercel will bundle the Vite frontend and expose the Express backend endpoints serverlessly under `/api`.

---

## 🛡️ License

This project is licensed under the MIT License.
