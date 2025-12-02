/**
 * A database-agnostic category model interface.
 * Can be used across MongoDB, PostgreSQL, or any ORM.
 */
export interface ICategoryEntity {
    id: string; // Unique identifier (maps to _id in MongoDB)
    name: string; // Category name, unique
    slug: string; // SEO-friendly URL slug, unique
    description?: string; // Optional description, max 500 chars
    icon?: string; // Optional icon URL or class
    color?: string; // Hex color code, default '#6366f1'
    parentId?: string | null; // Parent category ID, null if top-level
    postCount: number; // Number of posts in this category, default 0
    isActive: boolean; // Whether category is active, default true
    createdAt: Date; // Creation timestamp
    updatedAt?: Date; // Optional last updated timestamp
}
