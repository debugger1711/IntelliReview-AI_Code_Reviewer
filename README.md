# 🤖 IntelliReview - AI Code Reviewer

IntelliReview is a full-stack AI-powered code review platform that uses Google's Gemini API to generate intelligent, structured, and developer-friendly code reviews.

The application provides two specialized review modes:

* **Beginner Mode** → Focused on clean explanations, readability improvements, and learning-oriented feedback.
* **Interview Mode** → Focused on optimization, Big-O analysis, edge cases, and interview-level evaluation.

---

# 🚀 Features

* 🔐 JWT Authentication with secure login/signup flow
* 🤖 Gemini AI integration for automated code reviews
* 💡 Multi-language support (C++, Java, Python, JavaScript)
* ⚡ Dual review modes for learning and interview preparation
* 📊 Review history dashboard with delete functionality
* 🛡️ Security middleware using Helmet, bcryptjs, and rate limiting
* 🎨 Responsive UI built with React and Tailwind CSS

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini API

## Deployment & Tools

* Vercel
* Git & GitHub
* npm Workspaces

---

# 🗂️ Project Structure

```bash
├── api/                  # Vercel serverless entrypoint
├── backend/              # Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/             # React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── index.css
├── package.json
└── vercel.json
```

---

# 💻 Local Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd IntelliReview
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

## 4. Run the Application

### Start Backend

```bash
npm run dev --workspace=backend
```

### Start Frontend

```bash
npm run dev --workspace=frontend
```

Open `http://localhost:5173` in your browser.

---

# 📌 Future Improvements

* AI-generated optimization suggestions
* Dark/Light mode support
* Export review reports as PDF
* GitHub repository review integration

---

# 📄 License

This project is created for learning and portfolio purposes.
