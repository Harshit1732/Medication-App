const express = require ("express");
const dotenv = require( "dotenv");
const connectDB = require( "./config/db.js");
const cors = require ("cors");
const router = require("./routes/Userroute.js");
// import user from "./Routes/User.route.js";
dotenv.config();
const app=express()
// rest api
app.use(express.json());

//Cors config
app.use(
  cors({
    origin: "*",
  })
);
// PORT
const PORT = process.env.PORT || 8080;
// rest api's

// app.use("/user",user)
app.get("/", (req, res) => {
  res.send("Welcome to server help (backend)");
});

app.use('/user', router);


//connect database
app.listen(process.env.POR,async()=>{
  try{
    await connectDB()
    console.log(`Database connected and listening to http://localhost:${process.env.PORT}`)
  }
  catch(err){
    console.log(err)
    console.log("App is not listening")
  }
}) 