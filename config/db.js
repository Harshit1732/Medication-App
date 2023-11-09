import mongoose from "mongoose";

const MONGO_URL = "mongodb://0.0.0.0:27017";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL, {});
    console.log("Connection with mongoDb is Successfull 🤑");
  } catch (error) {
    console.error(`Error in MongoDB ${error}`);
  }
};

export default connectDB;
