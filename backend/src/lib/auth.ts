import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload } from './types';

// Secret key used to sign and verify JWT tokens
// This should always come from .env in production
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/* =========================================================
   Hash a plain password before saving it to the database
   ========================================================= */
export const hashPassword = async (password: string): Promise<string> => {
    // bcrypt.hash(password, saltRounds)
    // saltRounds = 10 → good balance between security and performance
    return await bcrypt.hash(password, 10);
};

/* =========================================================
   Compare plain password with hashed password from DB
   ========================================================= */
export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    // Returns true if passwords match, false otherwise
    return await bcrypt.compare(password, hash);
};

/* =========================================================
   Generate JWT token for authenticated users
   ========================================================= */
export const generateToken = (payload: JWTPayload): string => {
    /*
      jwt.sign(payload, secret, options)
      payload  → data stored inside the token (userId, email, etc.)
      secret   → used to sign the token
      expiresIn → token validity period
    */
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

/* =========================================================
   Verify and decode JWT token
   ========================================================= */
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        /*
          jwt.verify(token, secret)
          - If token is valid → returns decoded payload
          - If token is invalid/expired → throws error
        */
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        // If token verification fails, return null
        return null;
    }
};
