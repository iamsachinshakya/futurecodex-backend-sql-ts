// src/modules/comments/services/comment.service.ts
import { Types } from "mongoose";
import { ICommentEntity } from "../models/comment.entity";
import { ICommentService } from "./comment.service.interface";
import { ApiError } from "../../../common/utils/apiError";
import { RepositoryProvider } from "../../../RepositoryProvider";

export class CommentService implements ICommentService {

    async getCommentsByPost(postId: string, includeReplies = false): Promise<ICommentEntity[]> {
        if (!Types.ObjectId.isValid(postId)) throw new ApiError("Invalid postId", 400);
        const comments = await RepositoryProvider.commentRepository.findAll({ postId, parentCommentId: null });
        if (!includeReplies) return comments;

        // Fetch replies for each top-level comment
        const commentsWithReplies = await Promise.all(
            comments.map(async comment => {
                const replies = await this.getReplies(comment.id);
                return { ...comment, replies };
            })
        );
        return commentsWithReplies as ICommentEntity[];
    }

    async getCommentById(commentId: string): Promise<ICommentEntity | null> {
        const comment = await RepositoryProvider.commentRepository.findById(commentId);
        if (!comment) throw new ApiError("Comment not found", 404);
        return comment;
    }

    async createComment(postId: string, authorId: string, content: string, parentCommentId?: string | null): Promise<ICommentEntity> {
        if (!Types.ObjectId.isValid(postId)) throw new ApiError("Invalid postId", 400);
        if (!Types.ObjectId.isValid(authorId)) throw new ApiError("Invalid authorId", 400);
        if (parentCommentId && !Types.ObjectId.isValid(parentCommentId)) throw new ApiError("Invalid parentCommentId", 400);

        return RepositoryProvider.commentRepository.create({ postId, authorId, content, parentCommentId: parentCommentId || null });
    }

    async updateComment(commentId: string, content: string): Promise<ICommentEntity | null> {
        const existing = await RepositoryProvider.commentRepository.findById(commentId);
        if (!existing) throw new ApiError("Comment not found", 404);

        return RepositoryProvider.commentRepository.update(commentId, { content, isEdited: true });
    }

    async deleteComment(commentId: string, soft: boolean = true): Promise<boolean> {
        const existing = await RepositoryProvider.commentRepository.findById(commentId);
        if (!existing) throw new ApiError("Comment not found", 404);
        return RepositoryProvider.commentRepository.delete(commentId, soft);
    }

    async likeComment(commentId: string, userId: string): Promise<ICommentEntity | null> {
        const comment = await RepositoryProvider.commentRepository.findById(commentId);
        if (!comment) throw new ApiError("Comment not found", 404);

        if (!comment.likes.includes(userId)) comment.likes.push(userId);
        return RepositoryProvider.commentRepository.update(commentId, { likes: comment.likes });
    }

    async unlikeComment(commentId: string, userId: string): Promise<ICommentEntity | null> {
        const comment = await RepositoryProvider.commentRepository.findById(commentId);
        if (!comment) throw new ApiError("Comment not found", 404);

        comment.likes = comment.likes.filter(id => id !== userId);
        return RepositoryProvider.commentRepository.update(commentId, { likes: comment.likes });
    }

    async getReplies(commentId: string): Promise<ICommentEntity[]> {
        if (!Types.ObjectId.isValid(commentId)) throw new ApiError("Invalid commentId", 400);
        return RepositoryProvider.commentRepository.findAll({ parentCommentId: commentId });
    }

    async countLikes(commentId: string): Promise<number> {
        const comment = await RepositoryProvider.commentRepository.findById(commentId);
        if (!comment) throw new ApiError("Comment not found", 404);
        return comment.likes.length;
    }
}
