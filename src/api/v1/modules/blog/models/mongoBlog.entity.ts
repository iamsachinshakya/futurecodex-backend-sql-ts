// src/models/mongoose/blog.model.ts
import { Schema, model, Model, Types, Document } from "mongoose";
import { IBlogPostEntity, IBlogPostStatus, IBlogPostVisibility } from "./blog.entity";

/**
 * MongoDB-specific Blog Post interface
 */
export interface IBlogMongo extends Omit<IBlogPostEntity, "id" | "author" | "category" | "likes">, Document {
    _id: Types.ObjectId;
    author: Types.ObjectId; // reference to User
    category: Types.ObjectId; // reference to Category
    likes: {
        user: Types.ObjectId;
        likedAt: Date;
    }[];
}

const featuredImageSchema = new Schema({
    url: { type: String, required: true },
    alt: { type: String, default: null },
    caption: { type: String, default: null },
}, { _id: false });

const seoSchema = new Schema({
    metaTitle: { type: String, default: null },
    metaDescription: { type: String, default: null },
    keywords: [{ type: String, lowercase: true }],
    ogImage: { type: String, default: null },
}, { _id: false });

const likeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likedAt: { type: Date, default: Date.now },
}, { _id: false });

const blogSchema = new Schema<IBlogMongo>(
    {
        title: { type: String, required: true, minlength: 10, maxlength: 200 },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true, minlength: 100 },
        excerpt: { type: String, maxlength: 300, default: null },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        tags: [{ type: String, lowercase: true }],
        featuredImage: { type: featuredImageSchema, default: null },
        status: { type: String, enum: Object.values(IBlogPostStatus), default: IBlogPostStatus.DRAFT },
        visibility: { type: String, enum: Object.values(IBlogPostVisibility), default: IBlogPostVisibility.PUBLIC },
        viewCount: { type: Number, default: 0 },
        likes: { type: [likeSchema], default: [] },
        readTime: { type: Number, default: 0 }, // in minutes
        seo: { type: seoSchema, default: null },
        publishedAt: { type: Date, default: null },
        scheduledFor: { type: Date, default: null },
    },
    { timestamps: true }
);

export const Blog: Model<IBlogMongo> = model<IBlogMongo>("Blog", blogSchema);
