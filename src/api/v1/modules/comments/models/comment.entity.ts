/**
 * A database-agnostic comment model interface.
 * Can be used across MongoDB, PostgreSQL, or any ORM.
 */
export interface ICommentEntity {
    id: string; // Unique identifier (maps to _id in MongoDB)
    postId: string; // ID of the blog post this comment belongs to
    authorId: string; // ID of the user who created the comment
    content: string; // Comment text, 1-1000 characters
    parentCommentId?: string | null; // ID of parent comment if it's a reply
    likes: string[]; // Array of user IDs who liked this comment
    isEdited: boolean; // Whether the comment has been edited
    isDeleted: boolean; // Whether the comment has been deleted
    createdAt: Date; // Timestamp when the comment was created
    updatedAt?: Date; // Optional timestamp for last update
}
