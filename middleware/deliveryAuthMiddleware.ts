import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
interface DecodedToken {
  userId: string;
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
}

export const couriersAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    
    // Check if the user role is "customer"
    if (decoded.role !== 'deliveryAgent') {
      return res.status(403).json({ error: 'Forbidden - Only couriers are allowed' });
    }

    // If the user is a customer, proceed with the request
    next();
  } catch (error) {
    // Handle JWT verification errors
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};