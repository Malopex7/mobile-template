import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IRefreshTokenSession extends Document {
    user: Types.ObjectId;
    hashedToken: string;
    deviceInfo?: string;
    ipAddress?: string;
    expiresAt: Date;
    revokedAt?: Date;
    createdAt: Date;
}

const refreshTokenSessionSchema = new Schema<IRefreshTokenSession>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hashedToken: {
            type: String,
            required: true,
        },
        deviceInfo: String,
        ipAddress: String,
        expiresAt: {
            type: Date,
            required: true,
        },
        revokedAt: Date,
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt
    }
);

// Index to automatically delete expired sessions from the DB
refreshTokenSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSessionSchema.index({ user: 1 }); // Frequent queries by user

export const RefreshTokenSession: Model<IRefreshTokenSession> = mongoose.model<IRefreshTokenSession>(
    'RefreshTokenSession',
    refreshTokenSessionSchema
);
