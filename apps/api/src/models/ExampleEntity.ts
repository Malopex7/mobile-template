import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IExampleEntity extends Document {
    title: string;
    description?: string;
    ownerId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const exampleEntitySchema = new Schema<IExampleEntity>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

exampleEntitySchema.index({ ownerId: 1 });

export const ExampleEntity: Model<IExampleEntity> = mongoose.model<IExampleEntity>(
    'ExampleEntity',
    exampleEntitySchema
);
