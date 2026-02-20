import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { UserRole } from '@repo/shared';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                roles: UserRole[];
            };
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string; roles: UserRole[] };
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401));
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.roles.some((role) => roles.includes(role))) {
            return next(new AppError('Not authorized to access this route', 403));
        }
        next();
    };
};
