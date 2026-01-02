import mongoose from "mongoose";

const database_URI = process.env.DATABASE_URI.replace(
  /<PASSWORD>/,
  process.env.DATABASE_PASSWORD
);

export const connectDB = () => {
  mongoose.connect(database_URI).then(() => {
    console.log("Database connected successfully!");
  });
};
