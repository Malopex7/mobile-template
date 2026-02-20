import { Request, Response, NextFunction } from 'express';
import { ExampleEntity } from '../models/ExampleEntity';
import { AppError } from '../utils/AppError';
import { WS_EVENTS, CreateExampleEntitySchema, UpdateExampleEntitySchema } from '@repo/shared';
import { io } from '../server';

export const getExamples = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examples = await ExampleEntity.find({ ownerId: req.user?.id }).sort('-createdAt');
        res.status(200).json({ success: true, data: examples });
    } catch (error) {
        next(error);
    }
};

export const createExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = CreateExampleEntitySchema.parse(req.body);

        const example = await ExampleEntity.create({
            ...validated,
            ownerId: req.user?.id,
        });

        // Notify connected clients (Realtime Example)
        io.emit(WS_EVENTS.ENTITY_CREATED, example);

        res.status(201).json({ success: true, data: example });
    } catch (error) {
        next(error);
    }
};

export const updateExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = UpdateExampleEntitySchema.parse(req.body);

        let example = await ExampleEntity.findById(req.params.id);
        if (!example) {
            return next(new AppError('Example not found', 404));
        }

        if (example.ownerId.toString() !== req.user?.id) {
            return next(new AppError('Not authorized to update this example', 403));
        }

        example = await ExampleEntity.findByIdAndUpdate(req.params.id, validated, {
            new: true,
            runValidators: true,
        });

        // Notify connected clients (Realtime Example)
        io.emit(WS_EVENTS.ENTITY_UPDATED, example);

        res.status(200).json({ success: true, data: example });
    } catch (error) {
        next(error);
    }
};

export const deleteExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const example = await ExampleEntity.findById(req.params.id);
        if (!example) {
            return next(new AppError('Example not found', 404));
        }

        if (example.ownerId.toString() !== req.user?.id) {
            return next(new AppError('Not authorized to delete this example', 403));
        }

        await example.deleteOne();

        // Notify connected clients (Realtime Example)
        io.emit(WS_EVENTS.ENTITY_DELETED, { id: req.params.id });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
