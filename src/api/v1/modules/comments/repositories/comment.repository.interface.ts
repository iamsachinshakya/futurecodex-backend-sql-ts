import { ICommentEntity } from "../models/comment.entity";

/**
 * Interface for CommentRepository
 * Defines all methods the repository class must implement
 */
export interface ICommentRepository {
    /**
     * Find all comments by a filter
     * @param filter - Partial filter object
     */
    findAll(filter?: Partial<ICommentEntity>): Promise<ICommentEntity[]>;

    /**
     * Find comment by ID
     * @param commentId - ID of the comment
     */
    findById(commentId: string): Promise<ICommentEntity | null>;

    /**
     * Create a new comment
     * @param data - Partial comment data
     */
    create(data: Partial<ICommentEntity>): Promise<ICommentEntity>;

    /**
     * Update a comment
     * @param commentId - ID of the comment to update
     * @param data - Partial update data
     */
    update(commentId: string, data: Partial<ICommentEntity>): Promise<ICommentEntity | null>;

    /**
     * Delete a comment
     * @param commentId - ID of the comment
     * @param soft - Soft delete by default, hard delete if false
     */
    delete(commentId: string, soft?: boolean): Promise<boolean>;
}
