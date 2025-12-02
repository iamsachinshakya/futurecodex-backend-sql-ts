// src/modules/comments/controllers/comment.controller.ts
import { Request, Response } from "express";
import { ICommentController } from "./comment.controller.interface";
import { ServiceProvider } from "../../../ServiceProvider";
import { ApiResponse } from "../../../common/utils/apiResponse";

export class CommentController implements ICommentController {

    /**
     * Get all comments for a post, optionally including nested replies
     */
    async getCommentsByPost(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const includeReplies = req.query.includeReplies === "true";
        const comments = await ServiceProvider.commentService.getCommentsByPost(postId, includeReplies);
        return ApiResponse.success(res, "Comments fetched successfully", comments);
    }

    /**
     * Get a single comment by ID
     */
    async getCommentById(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const comment = await ServiceProvider.commentService.getCommentById(commentId);
        return ApiResponse.success(res, "Comment fetched successfully", comment);
    }

    /**
     * Create a new comment
     */
    async createComment(req: Request, res: Response): Promise<Response> {
        const { postId, content, parentCommentId } = req.body;
        const authorId = req.user?.id; // assuming user info is in req.user
        const comment = await ServiceProvider.commentService.createComment(postId, authorId!, content, parentCommentId);
        return ApiResponse.success(res, "Comment created successfully", comment);
    }

    /**
     * Update an existing comment's content
     */
    async updateComment(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const { content } = req.body;
        const updated = await ServiceProvider.commentService.updateComment(commentId, content);
        return ApiResponse.success(res, "Comment updated successfully", updated);
    }

    /**
     * Delete a comment (soft or hard)
     */
    async deleteComment(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const soft = req.query.soft !== "false"; // default true
        const result = await ServiceProvider.commentService.deleteComment(commentId, soft);
        return ApiResponse.success(res, "Comment deleted successfully", result);
    }

    /**
     * Like a comment
     */
    async likeComment(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const userId = req.user?.id;
        const comment = await ServiceProvider.commentService.likeComment(commentId, userId!);
        return ApiResponse.success(res, "Comment liked successfully", comment);
    }

    /**
     * Unlike a comment
     */
    async unlikeComment(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const userId = req.user?.id;
        const comment = await ServiceProvider.commentService.unlikeComment(commentId, userId!);
        return ApiResponse.success(res, "Comment unlike successfully", comment);
    }

    /**
     * Get all replies for a specific comment
     */
    async getReplies(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const replies = await ServiceProvider.commentService.getReplies(commentId);
        return ApiResponse.success(res, "Replies fetched successfully", replies);
    }

    /**
     * Count total likes of a comment
     */
    async countLikes(req: Request, res: Response): Promise<Response> {
        const { commentId } = req.params;
        const likesCount = await ServiceProvider.commentService.countLikes(commentId);
        return ApiResponse.success(res, "Likes counted successfully", { count: likesCount });
    }
}
