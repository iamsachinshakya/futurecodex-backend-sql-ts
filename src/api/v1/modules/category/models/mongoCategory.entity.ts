import { Schema, model, Model, Types, Document } from "mongoose";
import { ICategoryEntity } from "./category.entity";

/**
 * MongoDB-specific category interface
 */
export interface ICategoryMongo
    extends Omit<ICategoryEntity, "id" | "parentId">,
    Document {
    _id: Types.ObjectId;
    parentId?: Types.ObjectId | null;
}

const categorySchema = new Schema<ICategoryMongo>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, maxlength: 500, default: "" },
        icon: { type: String, default: null },
        color: { type: String, default: "#6366f1" },
        parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
        postCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// indexes for performance
categorySchema.index({ name: 1, slug: 1 });

export const Category: Model<ICategoryMongo> =
    model<ICategoryMongo>("Category", categorySchema);
