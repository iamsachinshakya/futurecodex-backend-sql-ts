import { z } from "zod";
import { IBlogPostStatus, IBlogPostVisibility } from "../models/blog.entity";

/**
 * ✳️ Featured Image Schema
 */
const featuredImageSchema = z.object({
    url: z.string().url("Invalid image URL"),
    alt: z.string().max(100).optional(),
    caption: z.string().max(200).optional(),
});

/**
 * ✳️ SEO Schema
 */
const seoSchema = z.object({
    metaTitle: z.string().max(120).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string().trim().min(1)).optional(),
    ogImage: z.string().url("Invalid OG image URL").optional(),
});

/**
 * ✳️ Create Blog Schema
 */
export const createBlogSchema = z
    .object({
        title: z.string().min(10, "Title must be at least 10 characters").max(200),
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly")
            .optional(),
        content: z.string().min(100, "Content must be at least 100 characters"),
        excerpt: z.string().max(300).optional(),

        author: z.string().uuid("Invalid author ID"),
        category: z.string().uuid("Invalid category ID"),
        tags: z.array(z.string().trim().min(1)).optional(),

        featuredImage: featuredImageSchema.optional(),

        status: z.nativeEnum(IBlogPostStatus).optional().default(IBlogPostStatus.DRAFT),
        visibility: z.nativeEnum(IBlogPostVisibility).optional().default(IBlogPostVisibility.PUBLIC),

        seo: seoSchema.optional(),

        scheduledFor: z.coerce.date().optional(),
    })
    .strict();

/**
 * ✳️ Update Blog Schema
 * - Partial updates only
 */
export const updateBlogSchema = z
    .object({
        title: z.string().min(10).max(200).optional(),
        slug: z
            .string()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
            .optional(),
        content: z.string().min(100).optional(),
        excerpt: z.string().max(300).optional(),

        category: z.string().uuid("Invalid category ID").optional(),
        tags: z.array(z.string().trim().min(1)).optional(),
        featuredImage: featuredImageSchema.optional(),

        status: z.nativeEnum(IBlogPostStatus).optional(),
        visibility: z.nativeEnum(IBlogPostVisibility).optional(),

        seo: seoSchema.optional(),

        scheduledFor: z.coerce.date().optional(),
    })
    .strict()
    .refine(
        (data) => Object.values(data).some((v) => v !== undefined && v !== null),
        { message: "At least one field must be provided for update." }
    );

/**
 * ✳️ Query Blog Schema
 * - Filtering & pagination
 */
export const queryBlogSchema = z
    .object({
        author: z.string().uuid("Invalid author ID").optional(),
        category: z.string().uuid("Invalid category ID").optional(),
        status: z.nativeEnum(IBlogPostStatus).optional(),
        visibility: z.nativeEnum(IBlogPostVisibility).optional(),

        tags: z
            .union([
                z.string().transform((val) => val.split(",")), // ?tags=tech,ai,cloud
                z.array(z.string()),
            ])
            .optional(),

        publishedBefore: z.coerce.date().optional(),
        publishedAfter: z.coerce.date().optional(),

        skip: z.coerce.number().int().min(0).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
    })
    .strict();

/**
 * ✳️ Schedule Blog Schema
 */
export const scheduleBlogSchema = z
    .object({
        scheduledFor: z.coerce.date().refine((date) => date > new Date(), {
            message: "Scheduled date must be in the future",
        }),
    })
    .strict();
