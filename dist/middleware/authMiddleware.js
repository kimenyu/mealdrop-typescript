// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import Customer from "../accounts/models/customer";
// const jwtsecret = process.env.JWT_SECRET as string;
// export default function verifyToken(req: Request, res: Response, next: NextFunction) {
//     const token = req.header("Authorization");
//     if (!token) {
//         return res.status(401).json({ message: "Access denied" });
//     }
//     try {
//         const decoded: unknown = jwt.verify(token.split(' ')[1], jwtsecret);
//         req.customerId = decoded.userId;
//         next();
//     } catch (err) {
//         return res.status(400).json({ message: "Invalid token" });
//     }
// }
//# sourceMappingURL=authMiddleware.js.map