// src/models/mongoose/comment.model.ts
import { Schema, model, Model, Types, Document } from "mongoose";
import { ICommentEntity } from "./comment.entity";

/**
 * MongoDB-specific comment interface
 */
export interface ICommentMongo
    extends Omit<ICommentEntity, "id" | "postId" | "authorId" | "parentCommentId">,
    Document {
    _id: Types.ObjectId;
    postId: Types.ObjectId;
    authorId: Types.ObjectId;
    parentCommentId?: Types.ObjectId | null;
}

const commentSchema = new Schema<ICommentMongo>(
    {
        postId: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
        authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true, minlength: 1, maxlength: 1000, trim: true },
        parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
        likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

// Optional indexes for faster queries
commentSchema.index({ postId: 1 });
commentSchema.index({ authorId: 1 });
commentSchema.index({ parentCommentId: 1 });

export const Comment: Model<ICommentMongo> = model<ICommentMongo>(
    "Comment",
    commentSchema
);
