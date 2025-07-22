import mongoose from "mongoose";
import { connectDatabase } from "../config/dbConnect.js";
import { Product } from "../model/productModel.js";
import products from "./data.js"; // Assuming you have a data.js file with product data
const seedProducts = async () => {
  try {
    connectDatabase();
    await Product.deleteMany();
    console.log("All existing products deleted");

    await Product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit(0);
  } catch {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};
seedProducts();
