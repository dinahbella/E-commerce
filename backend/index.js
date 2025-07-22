import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
