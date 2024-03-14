import express, { Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import { router } from "../routes/mealdropRoutes";
// import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());


// Cors middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

try {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}


// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWYyODRhOGQ4YTAyMmYyODVmNWE5NGIiLCJ1c2VyRW1haWwiOiJraW1lbnl1am9zZXBoNzNAZ21haWwuY29tIiwiaWF0IjoxNzEwNDQ0MDk5LCJleHAiOjE3MTA0NDc2OTl9.M8LzuMMcDykTmu90naAi3NXewrhJq4GQOvViK8BZz54';

// jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//   if (err) {
//     console.log('Failed to authenticate token');
//   } else {
//     console.log('Token successfully authenticated');
//     console.log(decoded);
//   }
// });

app.use("/api", router);
