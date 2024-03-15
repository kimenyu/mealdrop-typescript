"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminAuthMiddleware = (req, res, next) => {
    // Get the JWT token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // Check if the user role is "customer"
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden - Only admin are allowed' });
        }
        // If the user is a customer, proceed with the request
        next();
    }
    catch (error) {
        // Handle JWT verification errors
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
//# sourceMappingURL=adminAuthMiddleware.js.map