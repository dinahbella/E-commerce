import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGODB)
    .then((data) => {
      console.log(`✅ MongoDB connected with server successfully`);
    })
    .catch((error) => {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    });
};
