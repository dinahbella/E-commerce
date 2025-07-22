import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import productRoutes from "./routes/productRoutes.js";
dotenv.config({ path: "backend/config/config.env" });

const app = express();
const PORT = process.env.PORT || 3001;
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());
// app.use(bodyParser(json()));

// routes
app.use("/api/v1", productRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
