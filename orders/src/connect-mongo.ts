import mongoose from "mongoose";

export const connectMongo = async () => {
  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI!);

      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      console.error("MongoDB connection failed. Retrying in 5 seconds");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};
