import dotenv from "dotenv"         // Load environment variables from .env file
dotenv.config()                     // This will make the variables in .env available in process.env
import { app } from "./app.js";     

import connectDb from "./config/dbConnection.js";         


const PORT = process.env.PORT || 4000;


/* connectDb()              
  .then(() => {                                                // Connect to the database first, and if successful, start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  }); */

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();