import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { RefreshTokenSession } from '../models/RefreshTokenSession';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@repo/shared';

const generateAccessToken = (userId: string, roles: string[]) => {
    return jwt.sign({ id: userId, roles }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as unknown as number,
    });
};

const createRefreshToken = async (userId: string, req: Request) => {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Convert "7d" loosely to days to set expiry date. More robust parsing is recommended for prod.
    const days = parseInt(env.JWT_REFRESH_EXPIRES_IN.replace('d', '')) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const ipAddress = req.ip || req.socket.remoteAddress;
    const deviceInfo = req.headers['user-agent'];

    await RefreshTokenSession.create({
        user: userId,
        hashedToken,
        expiresAt,
        ipAddress,
        deviceInfo,
    });

    return refreshToken;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = RegisterSchema.parse(req.body);

        const userExists = await User.findOne({ email: validated.email });
        if (userExists) {
            return next(new AppError('User already exists', 400));
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(validated.password, salt);

        const user = await User.create({
            email: validated.email,
            name: validated.name,
            passwordHash,
        });

        const accessToken = generateAccessToken(user.id, user.roles);
        const refreshToken = await createRefreshToken(user.id, req);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = LoginSchema.parse(req.body);

        const user = await User.findOne({ email: validated.email });
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
        if (!isMatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        const accessToken = generateAccessToken(user.id, user.roles);
        const refreshToken = await createRefreshToken(user.id, req);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = RefreshTokenSchema.parse(req.body);
        const hashedToken = crypto.createHash('sha256').update(validated.refreshToken).digest('hex');

        const session = await RefreshTokenSession.findOne({
            hashedToken,
            expiresAt: { $gt: new Date() },
            revokedAt: { $exists: false },
        }).populate('user');

        if (!session || !session.user) {
            return next(new AppError('Invalid or expired refresh token', 401));
        }

        const user = session.user as unknown as { _id: { toString(): string }; email: string; name: string; roles: string[] };

        // Token Rotation Setup: Single use - revoke old token
        session.revokedAt = new Date();
        await session.save();

        // Create new pairs
        const newAccessToken = generateAccessToken(user._id.toString(), user.roles);
        const newRefreshToken = await createRefreshToken(user._id.toString(), req);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles,
                },
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await RefreshTokenSession.findOneAndUpdate({ hashedToken }, { revokedAt: new Date() });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
