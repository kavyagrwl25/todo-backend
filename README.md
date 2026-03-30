# 📝 Todo Backend API (MERN - Backend)

A clean and structured **RESTful backend API** for managing tasks, built using **Node.js, Express, and MongoDB**.
This project demonstrates core backend concepts including **authentication, CRUD operations, middleware, error handling, and secure APIs**.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication (access + refresh tokens)
* Secure cookie-based session handling
* Protected routes using middleware
* Logout functionality

### 📋 Task Management

* Create, update, delete tasks
* Get all tasks (sorted by latest)
* Get single task (user-specific)
* Mark task as completed/incomplete
* Each task is securely tied to its owner

### ⚙️ Backend Architecture

* MVC pattern (Routes → Controllers → Models)
* Custom error handling (`ApiError`)
* Standardized API responses (`ApiResponse`)
* Async error wrapper (`asyncHandler`)
* Input validation utilities

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (Access & Refresh Tokens)
* **Middleware:** Cookie Parser, CORS
* **Validation:** Custom validators

---

## 📁 Project Structure

```
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── db/
├── app.js
└── server.js
```

---

## 📡 API Endpoints

### 👤 User Routes

| Method | Endpoint                       | Description          |
| ------ | ------------------------------ | -------------------- |
| POST   | `/api/v1/users/register`       | Register user        |
| POST   | `/api/v1/users/login`          | Login user           |
| POST   | `/api/v1/users/refresh-tokens` | Refresh access token |
| POST   | `/api/v1/users/logout`         | Logout user          |

### 🔑 Current User

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| GET    | `/api/v1/users/me`          | Get current user |
| PATCH  | `/api/v1/users/me`          | Update profile   |
| PATCH  | `/api/v1/users/me/password` | Change password  |

---

### 📌 Task Routes (Protected)

| Method | Endpoint                           | Description       |
| ------ | ---------------------------------- | ----------------- |
| POST   | `/api/v1/tasks`                    | Create task       |
| GET    | `/api/v1/tasks`                    | Get all tasks     |
| GET    | `/api/v1/tasks/:taskId`            | Get single task   |
| PUT    | `/api/v1/tasks/:taskId`            | Update task       |
| DELETE | `/api/v1/tasks/:taskId`            | Delete task       |
| PATCH  | `/api/v1/tasks/:taskId/completion` | Toggle completion |

---

## 🔒 Security Features

* JWT authentication with token verification
* User-specific data access (no cross-user data leaks)
* HTTP-only cookies for tokens
* Centralized error handling

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-backend.git
cd todo-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
```

### 4. Run the server

```bash
npm run dev
```

---

## 🧪 Future Improvements

* Pagination & filtering for tasks
* API testing using Jest & Supertest
* File uploads (Multer + Cloudinary)
* Rate limiting & security enhancements
* Deployment (Render / AWS)

---

## 🎯 Learning Outcome

This project helped in understanding:

* REST API design
* Authentication flows (JWT)
* Middleware usage
* Error handling patterns
* Backend structuring for scalability

---

## 👨‍💻 Author

**Kavy**
Backend & Frontend Developer | MERN Stack

---

⭐ If you found this useful, consider giving it a star!
