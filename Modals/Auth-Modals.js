import mongoose from "mongoose";
const UserSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    mobile:Number
});

const UserModel=mongoose.model("userCollection",UserSchema)
export default UserModel