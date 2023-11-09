import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// config
dotenv.config();
connectDB();

// rest api
const app = express();

// rest api's
app.get("/", (req, res) => {
  res.send("Welcome to server help (backend)");
});

// PORT
const PORT = process.env.PORT || 8080;

//listening

app.listen(PORT, (req, res) => {
  console.log(`Server running on mode at port ${PORT} 😎`);
});