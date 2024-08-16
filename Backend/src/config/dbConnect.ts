import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};

export default dbConnection; 