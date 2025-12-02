import { ICreateCategory, IUpdateCategory } from "../models/category.dto";
import { ICategoryEntity } from "../models/category.entity";

export interface ICategoryService {
    /**
     * Get all categories with optional filters
     */
    getCategories(filter?: Partial<ICategoryEntity>): Promise<ICategoryEntity[]>;

    /**
     * Get a category by its ID
     * @param categoryId - ID of the category
     */
    getCategoryById(categoryId: string): Promise<ICategoryEntity | null>;

    /**
     * Create a new category
     * @param data - Category creation data from user
     */
    createCategory(data: ICreateCategory, file: Express.Multer.File): Promise<ICategoryEntity>;

    /**
     * Update an existing category
     * @param categoryId - ID of the category
     * @param data - Partial update data
     */
    updateCategory(categoryId: string, data: IUpdateCategory, file: Express.Multer.File): Promise<ICategoryEntity | null>;

    /**
     * Delete a category by ID
     * @param categoryId - ID of the category
     * @param soft - Soft delete by default, hard delete if false
     */
    deleteCategory(categoryId: string, soft?: boolean): Promise<boolean>;

    /**
    * Increment post count when a blog is added under this category
    */
    incrementPostCount(categoryId: string): Promise<void>;

    /**
     * Decrement post count when a blog is removed from this category
     */
    decrementPostCount(categoryId: string): Promise<void>;
}
