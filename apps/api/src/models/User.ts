import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserRole } from '@repo/shared';

// Interface loosely matching the zod schema
export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name?: string;
    roles: UserRole[];
    pushToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        roles: {
            type: [String],
            enum: ['user', 'admin'],
            default: ['user'],
        },
        pushToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
