const JWT  = require("jsonwebtoken")
const dotenv = require ("dotenv"); 
dotenv.config()
export const  auth = (req,res,next) =>{
    const token = req.headers?.authorization?.split(" ")[1];
    if(token){
        console.log(token)
        const decoded = JWT.verify(token,process.env.JWT_SECERT);
        console.log("d",decoded)
        if(decoded){
            const userID = decoded.userID;
            req.body.userID = userID;
            next();
        }
        else{
            res.status(400).send({"message" : "User Not Found, Try Logging In"})
        }
    }
    else{
        res.status(400).send({"message" : "User Not Found, Try Logging In"})
    }
}

