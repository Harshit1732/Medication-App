import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import UserModel from "./Modals/Auth-Modals.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken"
import auth from "./Middleware/authMiddleware.js"
dotenv.config();

// rest api
const app = express();
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
app.get("/", (req, res) => {
  res.send("Welcome to server help (backend)");
});


// User Authentication
app.post("/signup",async(req,res)=>{
  try{
    console.log(req.body.name);
  let data=await UserModel.find({email:req.body.email});
  console.log(data,"data from signup")
  if(data.length>0){
     res.status(200).send({msg:"User Already Exist"})
  }
  else{
     bcrypt.hash(req.body.password,4,async (err,hash)=>{
         if (err){
             res.status(500).send({msg:"SOMETHING WENT WRONG!"})
         }
         req.body.password = hash;
         req.body.administration=false;
         await UserModel.create(req.body);
         res.status(200).send({ msg: "User registered Successfully" });
     })
  }
  }
  catch(err){
    console.log(err.message)
     res.status(404).send({ msg: "Failed to create new user" });
  }
 })
 
 
 
 
 
 
 app.post("/login", async (req, res) => {
     try {
       let data = await UserModel.find({ email: req.body.email });
       if (data.length <= 0) {
         res.status(200).send({ msg: "User not found" });
       } else {
         bcrypt.compare(
           req.body.password,
           data[0].password,
            (err, result)=> {
             
             if (err) {
               res.status(500).send({ msg: "Something went wrong !" });
             } else if (result) {
               jwt.sign(
                 { userID: data[0]._id },
                 process.env.secreatkey,
                 (err, token) => {
                   res
                     .status(200)
                     .send({ msg: "User login Successfully", token: token,displayName:data[0].name,administration: data[0].administration});
                 }
               );
             }
             else{
                 res.status(200).send({msg:"Wrong password"})
             }
           }
         );
       }
     } catch (e) {
       console.log(e);
       res.status(404).send({ msg: "Failed to login" });
     }
   });
   
app.use(auth)





//connect database
app.listen(process.env.PORT,async()=>{
  try{
    await connectDB()
    console.log(`Database connected and listening to http://localhost:${process.env.PORT}`)
  }
  catch(err){
    console.log(err)
    console.log("App is not listening")
  }
})

