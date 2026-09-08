# 🚀 TaskFlow AI

> **AI-powered task management and productivity assistant built with Next.js, Prisma, Turso, and Google Gemini.**

TaskFlow AI is a modern productivity application that helps users organize, manage, and analyze their tasks. Create tasks, set priorities and deadlines, track progress, and use **Google Gemini AI** to receive an intelligent productivity analysis of your current workload.

🌐 **Live Demo:** https://project5-taskflow-ai.vercel.app/

📦 **GitHub Repository:** https://github.com/kamalbalwani16/Project5-taskflow-ai

---

## ✨ Features

### 📋 Task Management

* Create new tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as completed
* Track task status
* Set task priorities
* Add descriptions
* Set due dates

### 🤖 AI Productivity Assistant

TaskFlow AI integrates **Google Gemini** to analyze your tasks and provide useful productivity insights.

The AI assistant can help identify:

* 📌 High-priority tasks
* ⚠️ Overdue or urgent work
* 📊 Workload patterns
* 🎯 Productivity recommendations
* 💡 Suggestions for better task organization

### 💾 Persistent Database

Tasks are stored using **Turso/libSQL**, providing persistent production-ready storage.

Unlike a local SQLite database, tasks created on the deployed application remain available after refreshing the page.

### ☁️ Production Deployment

The application is deployed using **Vercel** with a production database hosted on **Turso**.

---

## 🛠️ Tech Stack

| Technology                  | Purpose                    |
| --------------------------- | -------------------------- |
| **Next.js 14**              | Full-stack React framework |
| **React 18**                | User interface             |
| **Prisma 7**                | Database ORM               |
| **Turso / libSQL**          | Production database        |
| **Google Gemini**           | AI productivity analysis   |
| **Tailwind CSS**            | Styling                    |
| **Vercel**                  | Deployment                 |
| **JavaScript / TypeScript** | Application development    |

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│          User                │
│                              │
│   Create / Edit / Manage     │
│          Tasks               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js Frontend       │
│                              │
│      TaskFlow AI UI          │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js API Routes     │
│                              │
│       /api/tasks             │
│       /api/ai                │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌───────────────┐  ┌────────────────┐
│ Prisma +      │  │ Google Gemini  │
│ Turso/libSQL  │  │ AI Assistant   │
└───────────────┘  └────────────────┘
```

---

## 📂 Project Structure

```text
project5-taskflow-ai/
│
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── route.js
│   │   └── tasks/
│   │       └── route.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   └── lib/
│       └── prisma.ts
│
├── public/
│
├── prisma.config.ts
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🗄️ Database Schema

TaskFlow AI uses Prisma with a `Task` model containing:

```text
Task
├── id
├── title
├── description
├── status
├── priority
├── dueDate
├── createdAt
└── updatedAt
```

### Task Status

```text
TODO
IN_PROGRESS
COMPLETED
```

### Task Priority

```text
LOW
MEDIUM
HIGH
```

---

## 🤖 Gemini AI Integration

The AI productivity assistant uses the **Google Gemini API** to analyze the user's current tasks.

The application sends the task information to Gemini and receives a productivity-focused analysis.

Example workflow:

```text
User Tasks
    ↓
Next.js API
    ↓
Google Gemini
    ↓
AI Productivity Analysis
    ↓
Results displayed in TaskFlow AI
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-turso-database-url"
DATABASE_AUTH_TOKEN="your-turso-auth-token"
GEMINI_API_KEY="your-gemini-api-key"
```

### Environment Variables

| Variable              | Description                          |
| --------------------- | ------------------------------------ |
| `DATABASE_URL`        | Turso/libSQL database connection URL |
| `DATABASE_AUTH_TOKEN` | Turso authentication token           |
| `GEMINI_API_KEY`      | Google Gemini API key                |

> ⚠️ **Never commit `.env` files or API keys to GitHub.**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kamalbalwani16/Project5-taskflow-ai.git
```

### 2. Navigate to the project

```bash
cd Project5-taskflow-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="your-turso-database-url"
DATABASE_AUTH_TOKEN="your-turso-auth-token"
GEMINI_API_KEY="your-gemini-api-key"
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

### 7. Open the application

Visit:

```text
http://localhost:3000
```

---

## 📦 Production Build

To create a production build:

```bash
npm run build
```

Start the production server with:

```bash
npm start
```

---

## ☁️ Deployment

TaskFlow AI is deployed on **Vercel**.

### Production URL

🌐 https://project5-taskflow-ai.vercel.app/

The production application uses:

```text
Vercel
   │
   ├── Next.js Application
   │
   ├── Prisma
   │
   └── Turso/libSQL
          │
          └── Persistent Task Data
```

### Vercel Environment Variables

Add the following variables to the Vercel project:

```text
DATABASE_URL
DATABASE_AUTH_TOKEN
GEMINI_API_KEY
```

After updating environment variables, redeploy the application.

---

## 🔄 Task Management Flow

```text
Create Task
     ↓
Task saved to Turso
     ↓
Task displayed in dashboard
     ↓
Edit / Complete / Delete
     ↓
Database updated
```

---

## 🎯 Why TaskFlow AI?

Traditional task managers help users **store tasks**.

TaskFlow AI goes one step further by combining task management with **AI-powered productivity insights**.

Instead of simply asking:

> "What tasks do I have?"

TaskFlow AI helps answer:

> "What should I focus on and how can I manage my workload better?"

---

## 🧪 Testing

The application has been tested for the following core functionality:

* ✅ Application loads successfully
* ✅ Create task
* ✅ Edit task
* ✅ Delete task
* ✅ Update task status
* ✅ Set task priority
* ✅ Set due dates
* ✅ Gemini AI analysis
* ✅ Persistent database storage
* ✅ Production deployment
* ✅ Task persistence after page refresh

---

## 📸 Screenshots

Add screenshots of the application here to make the GitHub repository more visually attractive.

Recommended screenshots:

1. **Dashboard**
2. **Create Task**
3. **Task List**
4. **AI Productivity Assistant**
5. **Completed Tasks**

Example:

```markdown
![TaskFlow AI Dashboard](./screenshots/dashboard.png)
```

---

## 🔮 Future Improvements

Some possible future enhancements:

* 🔐 User authentication
* 👥 Multiple user workspaces
* 📅 Calendar integration
* 🔔 Task reminders and notifications
* 📊 Productivity analytics dashboard
* 🧠 More advanced AI task prioritization
* 🔄 Real-time task synchronization
* 📱 Improved mobile experience
* 🏷️ Task categories and tags

---

## 📚 Learning Outcomes

This project demonstrates practical experience with:

* Next.js full-stack development
* React component development
* REST API design
* Prisma ORM
* SQL databases
* Turso/libSQL
* Environment variable management
* Google Gemini API integration
* Tailwind CSS
* Production deployment with Vercel
* Database persistence in serverless environments
* Git and GitHub workflow

---

## 👨‍💻 Author

### Kamal Balwani

Computer Science Engineering Student

🔗 GitHub: https://github.com/kamalbalwani16

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub!

---

## 📄 License

This project is intended for educational and portfolio purposes.
