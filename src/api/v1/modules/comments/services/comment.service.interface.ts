import { ICommentEntity } from "../models/comment.entity";

export interface ICommentService {
    /**
     * Get all comments for a specific post, optionally with nested replies
     * @param postId - ID of the post
     * @param includeReplies - Whether to include nested replies
     */
    getCommentsByPost(postId: string, includeReplies?: boolean): Promise<ICommentEntity[]>;

    /**
     * Get a single comment by its ID
     * @param commentId - ID of the comment
     */
    getCommentById(commentId: string): Promise<ICommentEntity | null>;

    /**
     * Create a new comment
     * @param postId - ID of the post
     * @param authorId - ID of the user creating the comment
     * @param content - Comment text
     * @param parentCommentId - Optional ID of the parent comment if it's a reply
     */
    createComment(
        postId: string,
        authorId: string,
        content: string,
        parentCommentId?: string | null
    ): Promise<ICommentEntity>;

    /**
     * Update a comment's content
     * @param commentId - ID of the comment
     * @param content - New comment text
     */
    updateComment(commentId: string, content: string): Promise<ICommentEntity | null>;

    /**
     * Delete a comment
     * @param commentId - ID of the comment
     * @param soft - Soft delete by default, hard delete if false
     */
    deleteComment(commentId: string, soft?: boolean): Promise<boolean>;

    /**
     * Like a comment
     * @param commentId - ID of the comment
     * @param userId - ID of the user liking the comment
     */
    likeComment(commentId: string, userId: string): Promise<ICommentEntity | null>;

    /**
     * Remove like from a comment
     * @param commentId - ID of the comment
     * @param userId - ID of the user removing the like
     */
    unlikeComment(commentId: string, userId: string): Promise<ICommentEntity | null>;

    /**
     * Get all replies for a specific comment
     * @param commentId - ID of the parent comment
     */
    getReplies(commentId: string): Promise<ICommentEntity[]>;

    /**
     * Count total likes of a comment
     * @param commentId - ID of the comment
     */
    countLikes(commentId: string): Promise<number>;
}
