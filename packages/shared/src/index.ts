import { z } from 'zod';

// ====== Auth Schemas ======

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;


// ====== User Schemas ======

export const UserRoleSchema = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserResponseSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
    roles: z.array(UserRoleSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z.object({
    user: UserResponseSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;


// ====== ExampleEntity Schemas ======

export const CreateExampleEntitySchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
});
export type CreateExampleEntityInput = z.infer<typeof CreateExampleEntitySchema>;

export const UpdateExampleEntitySchema = CreateExampleEntitySchema.partial();
export type UpdateExampleEntityInput = z.infer<typeof UpdateExampleEntitySchema>;

export const ExampleEntityResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    ownerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type ExampleEntityResponse = z.infer<typeof ExampleEntityResponseSchema>;

// ====== Constants ======

export const WS_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    AUTHENTICATE: 'authenticate',
    AUTHENTICATED: 'authenticated',
    UNAUTHORIZED: 'unauthorized',
    ENTITY_UPDATED: 'entity_updated',
    ENTITY_CREATED: 'entity_created',
    ENTITY_DELETED: 'entity_deleted',
} as const;
