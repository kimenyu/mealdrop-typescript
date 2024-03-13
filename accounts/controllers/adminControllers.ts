import Admin from "../models/admin";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import isValidNumber from "../../utils/number-parser/numParser";
import { validate } from "email-validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


const jwtsecret = process.env.JWT_SECRET;

export const createAdmin = async (req: Request, res: Response) => {
    const { username, email, password,  phoneNum } = req.body;
    console.log(req.body);

    try {
        if (!username || !email || !password || !phoneNum) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!isValidNumber(phoneNum)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const existingPhoneNum = await Admin.findOne({
            phoneNum
        });
        if (existingPhoneNum) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        const existingUsername = await Admin.findOne({
            username
        });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!validate(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const existingEmail = await Admin.findOne({
            email
        });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const customer = await Admin.findOne({ email });
        if (customer) {
            return res.status(400).json({ message: "Account already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
            phoneNum
        });

        const result = await newAdmin.save();
        return res.status(201).json({ message: "Account created successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const loginAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: "Customer does not exist" });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: admin._id, userEmail: admin.email}, jwtsecret, { expiresIn: "1h" });
        return res.status(200).json({ message: "Admin logged in successfully", email: admin.email, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}