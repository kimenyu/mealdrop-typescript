"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const mealdropRoutes_1 = require("../routes/mealdropRoutes");
// import jwt from "jsonwebtoken";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
// Cors middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// MongoDB connection
mongoose_1.default.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
try {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
catch (error) {
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
app.use("/api", mealdropRoutes_1.router);
//# sourceMappingURL=app.js.map