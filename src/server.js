import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js";

import connectDb from "./config/dbConnection.js";


const PORT = process.env.PORT || 4000;


connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });