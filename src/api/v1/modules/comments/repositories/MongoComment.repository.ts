// src/modules/comments/repositories/comment.repository.ts
import { Types } from "mongoose";
import { ICommentEntity } from "../models/comment.entity";
import { Comment, ICommentMongo } from "../models/mongoComment.entity";

export class CommentRepository {
    /**
     * Find all comments by a filter
     */
    async findAll(filter: Partial<ICommentEntity> = {}): Promise<ICommentEntity[]> {
        const query: any = {};

        if (filter.postId) query.postId = filter.postId;
        if (filter.parentCommentId !== undefined) query.parentCommentId = filter.parentCommentId;
        if (filter.authorId) query.authorId = filter.authorId;

        const comments = await Comment.find(query).lean() as unknown as ICommentMongo[];
        return comments.map(this.toEntity);
    }

    /**
     * Find comment by ID
     */
    async findById(commentId: string): Promise<ICommentEntity | null> {
        if (!Types.ObjectId.isValid(commentId)) return null;
        const comment = await Comment.findById(commentId).lean() as ICommentMongo | null;
        return comment ? this.toEntity(comment) : null;
    }

    /**
     * Create a new comment
     */
    async create(data: Partial<ICommentEntity>): Promise<ICommentEntity> {
        const comment = await Comment.create(data);
        return this.toEntity(comment.toObject());
    }

    /**
     * Update a comment
     */
    async update(commentId: string, data: Partial<ICommentEntity>): Promise<ICommentEntity | null> {
        const updated = await Comment.findByIdAndUpdate(commentId, data, { new: true }).lean() as ICommentMongo | null;
        return updated ? this.toEntity(updated) : null;
    }

    /**
     * Delete a comment (soft or hard)
     */
    async delete(commentId: string, soft: boolean = true): Promise<boolean> {
        if (soft) {
            const result = await Comment.findByIdAndUpdate(commentId, { isDeleted: true });
            return !!result;
        } else {
            const result = await Comment.findByIdAndDelete(commentId);
            return !!result;
        }
    }

    /**
     * Convert Mongo document to ICommentEntity
     */
    private toEntity(comment: ICommentMongo): ICommentEntity {
        return {
            id: comment._id.toString(),
            postId: comment.postId.toString(),
            authorId: comment.authorId.toString(),
            content: comment.content,
            parentCommentId: comment.parentCommentId?.toString() || null,
            likes: comment.likes.map(id => id.toString()),
            isEdited: comment.isEdited,
            isDeleted: comment.isDeleted,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        };
    }
}
