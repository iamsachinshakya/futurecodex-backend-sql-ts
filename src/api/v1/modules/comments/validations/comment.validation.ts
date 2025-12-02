// src/modules/comments/validations/comment.validation.ts
import { z } from "zod";

/**
 * Zod schema for creating a comment
 * - id, likes, isEdited, isDeleted, createdAt, updatedAt are generated automatically
 */
export const createCommentSchema = z.object({
    postId: z.string().min(1, "Post ID is required"),
    content: z
        .string()
        .trim()
        .min(1, "Content must not be empty")
        .max(1000, "Content must be less than 1000 characters"),
    parentCommentId: z.string().optional().nullable(),
});

/**
 * Zod schema for updating a comment
 * - Only content can be updated
 * - At least one field must be provided
 */
export const updateCommentSchema = z
    .object({
        content: z
            .string()
            .trim()
            .min(1, "Content must not be empty")
            .max(1000, "Content must be less than 1000 characters")
            .optional(),
    })
    .strict()
    .refine(
        (data) =>
            Object.values(data).some(
                (value) =>
                    value !== undefined &&
                    value !== null &&
                    (typeof value !== "string" || value.trim() !== "")
            ),
        {
            message: "At least one field must be provided for update.",
            path: [],
        }
    );

/**
 * Zod schema for query params / filtering comments
 * - All fields optional
 * - includeReplies and parentCommentId are optional
 */
export const queryCommentsSchema = z
    .object({
        postId: z.string().min(1, "Post ID cannot be empty").optional(),
        parentCommentId: z.string().optional().nullable(),
        authorId: z.string().optional(),
        includeReplies: z
            .union([z.literal("true"), z.literal("false"), z.boolean()])
            .transform((val) => val === "true" || val === true)
            .optional(),
    })
    .strict();
