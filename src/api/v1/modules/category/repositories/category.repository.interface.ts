import { ICreateCategory, IUpdateCategory } from "../models/category.dto";
import { ICategoryEntity } from "../models/category.entity";

/**
 * Interface for Category Repository
 * Handles direct database operations for categories
 */
export interface ICategoryRepository {
    /**
     * Create a new category in the database
     * @param data - Category data to create
     * @returns Created category
     */
    create(data: ICreateCategory): Promise<ICategoryEntity>;

    /**
     * Find a category by its unique ID
     * @param id - Category ID
     * @returns Category if found, otherwise null
     */
    findById(id: string): Promise<ICategoryEntity | null>;

    /**
     * Find categories matching optional filters
     * @param filter - Partial category data to filter by
     * @returns Array of matching categories
     */
    findAll(filter?: Partial<ICategoryEntity>): Promise<ICategoryEntity[]>;

    /**
     * Update a category by its ID
     * @param id - Category ID
     * @param data - Partial data to update
     * @returns Updated category or null if not found
     */
    update(id: string, data: IUpdateCategory): Promise<ICategoryEntity | null>;

    /**
     * Delete a category by its ID
     * @param id - Category ID
     * @param soft - Soft delete if true (default true)
     * @returns True if deleted, false if not found
     */
    delete(id: string, soft?: boolean): Promise<boolean>;

    /**
     * Optional: Find a category by its slug
     * @param slug - Category slug
     * @returns Category if found, otherwise null
     */
    findBySlug?(slug: string): Promise<ICategoryEntity | null>;

    /**
   * ⬆️ Increment the post count for a category
   * - Typically used when a new blog post is created under this category.
   * @param categoryId - The ID of the category whose post count should be increased
   * @returns A promise that resolves when the operation is complete
   */
    incrementPostCount(categoryId: string): Promise<void>;

    /**
     * ⬇️ Decrement the post count for a category
     * - Typically used when a blog post is deleted or moved out of this category.
     * @param categoryId - The ID of the category whose post count should be decreased
     * @returns A promise that resolves when the operation is complete
     */
    decrementPostCount(categoryId: string): Promise<void>;
}
