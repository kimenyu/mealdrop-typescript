import Admin from "../models/admin";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import isValidNumber from "../../utils/number-parser/numParser";
import { validate } from "email-validator";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import generateVerificationCode from "../../utils/verification/verifyaccounts";


import dotenv from 'dotenv';
dotenv.config();


const jwtsecret = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const createAdmin = async (req: Request, res: Response) => {
    const { username, email, password, phoneNum } = req.body;

    try {
        if (!username || !email || !password || !phoneNum) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!isValidNumber(phoneNum)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const existingPhoneNum = await Admin.findOne({ phoneNum });
        if (existingPhoneNum) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        const existingUsername = await Admin.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!validate(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const customer = await Admin.findOne({ email });
        if (customer) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        const verificationCode: string = generateVerificationCode().toString();


        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
            phoneNum, 
            verificationCode
        });

        const result = await newAdmin.save();


        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender address
            to: email, // List of recipients
            subject: 'Code verification', // Subject line
            text: `Hello ${username},\n\nYour verification code is: ${verificationCode}.\n\nRegards,\nMealDrop Team` // Plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: "Failed to send verification email" });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ message: "Registration successful. Verification code sent to your email." });
            }
        });

        return res.status(201).json({ message: "Customer created successfully", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Verification endpoint
export const verifyEmailAdmin =  async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    try {
        // Find the customer by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Check if the provided verification code matches the stored one
        if (admin.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Update customer verification status
        admin.isVerified = true;
        await admin.save();

        return res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const loginAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: "Customer does not exist" });
        }

        if (!admin.isVerified) {
            return res.status(401).json({ message: "Email not verified. Please verify your email first." });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: admin._id, userEmail: admin.email}, jwtsecret, { expiresIn: "1h" });
        return res.status(200).json({ message: "Customer logged in successfully", email: admin.email, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}