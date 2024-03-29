import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
}

// Extend the Request interface to include a 'user' property
interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Get the JWT token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'process.env.JWT_SECRET') as DecodedToken;
    
    // Attach user ID and role to request object
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    // Proceed with the request
    next();
  } catch (error) {
    // Handle JWT verification errors
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};