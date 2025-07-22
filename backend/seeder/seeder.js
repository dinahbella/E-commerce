import mongoose from "mongoose";
import { connectDatabase } from "../config/dbConnect.js";
import { Product } from "../model/productModel.js"; // ✅ Default import
import products from "./data.js"; // ✅ Make sure this exports an array

const seedProducts = async () => {
  try {
    await connectDatabase(); // ✅ Connect to MongoDB

    await Product.deleteMany();
    console.log("🗑️ All existing products deleted");

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully");

    process.exit(0);
  } catch (error) {
    // ✅ Fix: catch receives the error
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
