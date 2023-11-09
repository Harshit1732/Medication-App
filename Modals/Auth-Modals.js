import mongoose from "mongoose";
const UserSchema=mongoose.Schema({
    name:{
       type: String,
    },
    email:{
        type: String
    },
    password:{
       type: String
    },
    mobile:{
        type: Number
    }
});

const UserModel=mongoose.model("userCollection",UserSchema)
export default UserModel