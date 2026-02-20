import { Request, Response, NextFunction } from 'express';
import { storageService } from '../services/storage';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const CreateUploadUrlSchema = z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
});

export const getUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = CreateUploadUrlSchema.parse(req.body);

        const { url, path } = await storageService.getSignedUploadUrl(
            validated.fileName,
            validated.contentType
        );

        res.status(200).json({
            success: true,
            data: {
                uploadUrl: url,
                path,
            },
        });
    } catch (error) {
        next(new AppError('Failed to generate upload URL', 500));
    }
};
