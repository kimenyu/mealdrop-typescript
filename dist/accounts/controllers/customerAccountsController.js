"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCustomer = exports.verifyEmail = exports.createCustomer = void 0;
const customer_1 = __importDefault(require("../models/customer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const numParser_1 = __importDefault(require("../../utils/number-parser/numParser"));
const email_validator_1 = require("email-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const verifyaccounts_1 = __importDefault(require("../../utils/verification/verifyaccounts"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtsecret = process.env.JWT_SECRET;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, phoneNum } = req.body;
    console.log(req.body);
    try {
        if (!username || !email || !password || !phoneNum) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, numParser_1.default)(phoneNum)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }
        const existingPhoneNum = yield customer_1.default.findOne({ phoneNum });
        if (existingPhoneNum) {
            return res.status(400).json({ message: "Phone number already exists" });
        }
        const existingUsername = yield customer_1.default.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (!(0, email_validator_1.validate)(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const existingEmail = yield customer_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const customer = yield customer_1.default.findOne({ email });
        if (customer) {
            return res.status(400).json({ message: "Customer already exists" });
        }
        const verificationCode = (0, verifyaccounts_1.default)().toString();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newCustomer = new customer_1.default({
            username,
            email,
            password: hashedPassword,
            phoneNum,
            verificationCode
        });
        const result = yield newCustomer.save();
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
            }
            else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ message: "Registration successful. Verification code sent to your email." });
            }
        });
        return res.status(201).json({ message: "Customer created successfully", result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCustomer = createCustomer;
// Verification endpoint
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
        // Find the customer by email
        const customer = yield customer_1.default.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        // Check if the provided verification code matches the stored one
        if (customer.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        // Update customer verification status
        customer.isVerified = true;
        yield customer.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Verification Successful',
            text: 'Congratulations! Your account has been successfully verified.'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                // Handle email sending error
            }
            else {
                console.log('Verification email sent: ' + info.response);
                // Handle email sending success
            }
        });
        return res.status(200).json({ message: "Verification successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmail = verifyEmail;
const loginCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const customer = yield customer_1.default.findOne({ username });
        if (!customer) {
            return res.status(400).json({ message: "Customer does not exist" });
        }
        if (!customer.isVerified) {
            return res.status(401).json({ message: "Email not verified. Please verify your email first." });
        }
        const validPassword = yield bcrypt_1.default.compare(password, customer.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // const token = jwt.sign({ userId: customer._id, userEmail: customer.email}, jwtsecret, { expiresIn: "1h" });
        const token = jsonwebtoken_1.default.sign({
            userId: customer._id,
            userEmail: customer.email,
            role: 'customer',
            iat: Date.now(),
            exp: Date.now() + 3600 * 24 * 7, // token expires in 7 days
        }, jwtsecret);
        return res.status(200).json({ message: "Customer logged in successfully", email: customer.email, token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginCustomer = loginCustomer;
// Reset Password
// app.post('/password/reset', async (req: Request, res: Response) => {
//     const { token, newPassword } = req.body;
//     try {
//         // Find the customer by reset token
//         const customer = await Customer.findOne({ resetToken: token });
//         if (!customer) {
//             return res.status(404).json({ message: "Invalid or expired token" });
//         }
//         // Update password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         customer.password = hashedPassword;
//         customer.resetToken = undefined;
//         await customer.save();
//         return res.status(200).json({ message: "Password reset successful" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// });
//# sourceMappingURL=customerAccountsController.js.map