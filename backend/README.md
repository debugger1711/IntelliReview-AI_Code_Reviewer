# 🤖 AI Code Reviewer

A production-style backend that lets users submit code and receive AI-generated reviews using Google's Gemini API.

---

## ✨ Features

- 🔐 JWT Authentication (Signup / Login)
- 🤖 AI Code Review via Gemini API
- 🎯 Two Review Modes: **Beginner** and **Interview**
- 📝 Review History stored in MongoDB
- 🛡️ Security: Helmet, CORS, Rate Limiting
- ✅ Input Validation & Error Handling
- 📦 Clean MVC Architecture

---

## 🗂️ Project Structure

```
src/
 ├── config/         # Database connection
 ├── controllers/    # Route logic (auth, review)
 ├── middleware/     # Auth, validation, error handler
 ├── models/         # Mongoose schemas (User, Review)
 ├── routes/         # Express route definitions
 ├── services/       # Gemini API service + prompt engineering
 ├── utils/          # AppError class, asyncHandler
 ├── app.js          # Express app setup
 └── server.js       # Entry point
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Fill in your values in .env
```

### 4. Run the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `GEMINI_API_KEY` | Your Google Gemini API key |

---

## 📡 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Code Review *(requires Bearer token)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/review` | Submit code for AI review |
| GET | `/api/reviews` | Get all your reviews |
| GET | `/api/reviews/:id` | Get a specific review |
| DELETE | `/api/reviews/:id` | Delete a review |

**Review Request:**
```json
{
  "language": "python",
  "mode": "beginner",
  "code": "for i in range(10):\n  print(i)"
}
```

**Review Response:**
```json
{
  "success": true,
  "reviewId": "...",
  "language": "python",
  "mode": "beginner",
  "review": {
    "bugs": [],
    "suggestions": ["Consider adding a comment explaining what this loop does."],
    "readability": ["Good use of range(). Easy to read."],
    "optimization": ["This is already quite efficient for a simple loop."],
    "timeComplexity": "O(n) — the loop runs n times (10 in this case).",
    "spaceComplexity": "O(1) — no extra memory is used."
  }
}
```

**Supported Languages:** `cpp`, `java`, `python`, `javascript`

**Supported Modes:** `beginner`, `interview`

---

## ☁️ Deployment

### Render
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add environment variables in the Render dashboard

### Railway
1. Push code to GitHub
2. Create a new project on [railway.app](https://railway.app)
3. Connect your GitHub repo
4. Add environment variables
5. Railway auto-detects Node.js and deploys

---

## 🛡️ Security

- Passwords hashed with **bcryptjs**
- Routes protected with **JWT**
- **Helmet** for secure HTTP headers
- **Rate limiting** (100 req / 15 min per IP)
- **CORS** enabled
- Body size limited to **10kb**

---

## 📄 License

MIT
