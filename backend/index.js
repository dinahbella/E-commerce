import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import { connectDatabase } from "./config/dbConnect.js";
import ErrorHandler from "./utills/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//  handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}`);
  console.log("Shutting down the server due to uncaught exception...");
  process.exit(1);
});

dotenv.config({ path: "backend/config/config.env" });

const app = express();
connectDatabase();
const PORT = process.env.PORT || 3001;
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors());

// routes
app.use("/api/v1", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
// error handler
app.use(ErrorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// handle unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Rejection: ${error.message}`);
  console.log("Shutting down the server due to unhandled promise rejection...");
  server.close(() => {
    process.exit(1);
  });
});
