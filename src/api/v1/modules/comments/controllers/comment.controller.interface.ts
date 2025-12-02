import { Request, Response } from "express";

/**
 * Interface for CommentController
 * Defines all controller methods for handling HTTP requests
 */
export interface ICommentController {
    /**
     * Get all comments for a post, optionally including nested replies
     */
    getCommentsByPost(req: Request, res: Response): Promise<Response>;

    /**
     * Get a single comment by ID
     */
    getCommentById(req: Request, res: Response): Promise<Response>;

    /**
     * Create a new comment
     */
    createComment(req: Request, res: Response): Promise<Response>;

    /**
     * Update an existing comment's content
     */
    updateComment(req: Request, res: Response): Promise<Response>;

    /**
     * Delete a comment (soft or hard)
     */
    deleteComment(req: Request, res: Response): Promise<Response>;

    /**
     * Like a comment
     */
    likeComment(req: Request, res: Response): Promise<Response>;

    /**
     * Unlike a comment
     */
    unlikeComment(req: Request, res: Response): Promise<Response>;

    /**
     * Get all replies for a specific comment
     */
    getReplies(req: Request, res: Response): Promise<Response>;

    /**
     * Count total likes of a comment
     */
    countLikes(req: Request, res: Response): Promise<Response>;
}
