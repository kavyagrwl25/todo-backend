# MERN Authentication Backend

This project is a backend authentication system built using the MERN stack. It includes user authentication features such as password hashing and secure login handling.

## Features

- User authentication system
- Password hashing using bcrypt
- MongoDB database integration
- Mongoose models for data management
- Express.js server setup
- Environment variable configuration

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- JSON Web Tokens (JWT)

## Installation

1. Clone the repository


git clone <repository-url>


2. Navigate to the project folder


cd <project-folder>


3. Install dependencies


npm install


4. Create a `.env` file and add the required environment variables


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


5. Start the server


npm run dev


## Project Structure


src/
│
├── controllers
├── models
├── routes
├── middlewares
├── utils
├── db
└── app.js


## Author

Kavy Agrawal
