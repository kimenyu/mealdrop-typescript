"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Get the JWT token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, 'process.env.JWT_SECRET');
        // Attach user ID and role to request object
        req.user = {
            id: decoded.userId,
            role: decoded.role
        };
        // Proceed with the request
        next();
    }
    catch (error) {
        // Handle JWT verification errors
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map