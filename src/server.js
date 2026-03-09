import dotenv from "dotenv"
dotenv.config()
import express from "express"   
import connectDb from "./config/dbConnection.js";

const app = express()                // Create an Express application instance

app.use(express.json());             // Middleware to parse JSON bodies

const PORT = process.env.PORT || 4000;


connectDb().then(() => {                        // Connect to the database and then start the express server
    app.listen(PORT, () => {                                           
        console.log("Server is running on port " + PORT)
    })
});