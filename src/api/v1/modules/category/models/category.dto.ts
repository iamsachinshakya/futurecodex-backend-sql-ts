
/**
 * Data required from user to create a category
 * Excludes system-generated fields like id, postCount, createdAt
 */
export interface ICreateCategory {
    name: string; // Category name (required)
    slug?: string; // Optional slug, auto-generated if not provided
    description?: string; // Optional description, max 500 chars
    icon?: string; // Optional icon URL or class
    color?: string; // Optional hex color, default #6366f1
    parentId?: string | null; // Optional parent category ID
    isActive?: boolean; // Optional, default true
}

/**
 * Data allowed from user to update a category
 * All fields are optional for partial updates
 */
export interface IUpdateCategory {
    name?: string; // Update category name
    description?: string; // Optional description, max 500 chars
    color?: string; // Optional hex color
    parentId?: string | null; // Optional parent category ID
    isActive?: boolean; // Optional active flag
    icon?: string; // Optional not for validation it updated via service layer
    slug?: string; // Optional not for validation it updated via service layer
}
