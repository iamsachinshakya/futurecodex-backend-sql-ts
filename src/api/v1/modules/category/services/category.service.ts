// src/modules/categories/services/category.service.ts
import { Types } from "mongoose";
import slugify from "slugify";

import { ICategoryService } from "./category.service.interface";
import { RepositoryProvider } from "../../../RepositoryProvider";
import { ApiError } from "../../../common/utils/apiError";
import { uploadOnCloudinary } from "../../../common/utils/cloudinary.util";
import { generateShortId } from "../../../common/utils/common.util";
import { ICategoryEntity } from "../models/category.entity";
import { ICreateCategory, IUpdateCategory } from "../models/category.dto";

export class CategoryService implements ICategoryService {
    /**
     * ✅ Get all categories (with optional filters)
     */
    async getCategories(filter?: Partial<ICategoryEntity>): Promise<ICategoryEntity[]> {
        return RepositoryProvider.categoryRepository.findAll(filter);
    }

    /**
     * ✅ Get category by ID
     */
    async getCategoryById(categoryId: string): Promise<ICategoryEntity> {
        const category = await RepositoryProvider.categoryRepository.findById(categoryId);
        if (!category) throw new ApiError("Category not found", 404);
        return category;
    }

    /**
     * ✅ Create a new category
     */
    async createCategory(
        data: ICreateCategory,
        file?: Express.Multer.File
    ): Promise<ICategoryEntity> {
        // Handle optional icon upload
        if (file?.buffer) {
            const uploaded = await uploadOnCloudinary(file.buffer, generateShortId("cat"), "categories");
            if (!uploaded?.secure_url) throw new ApiError("Failed to upload category icon", 400);
            data.icon = uploaded.secure_url;
        }

        // Generate slug
        data.slug = slugify(data.name, { lower: true, strict: true });

        // Validate parentId
        if (data.parentId) {
            if (!Types.ObjectId.isValid(data.parentId)) throw new ApiError("Invalid parentId", 400);
            const parent = await RepositoryProvider.categoryRepository.findById(data.parentId);
            if (!parent) throw new ApiError("Parent category not found", 404);
        }

        return RepositoryProvider.categoryRepository.create(data);
    }

    /**
     * ✅ Update category
     */
    async updateCategory(
        categoryId: string,
        data: IUpdateCategory,
        file?: Express.Multer.File
    ): Promise<ICategoryEntity | null> {
        const existing = await RepositoryProvider.categoryRepository.findById(categoryId);
        if (!existing) throw new ApiError("Category not found", 404);

        // Optional icon update
        if (file?.buffer) {
            const uploaded = await uploadOnCloudinary(file.buffer, generateShortId("cat"), "categories");
            if (!uploaded?.secure_url) throw new ApiError("Failed to upload category icon", 400);
            data.icon = uploaded.secure_url;
        }

        // Regenerate slug if name changes
        if (data.name) {
            data.slug = slugify(data.name, { lower: true, strict: true });
        }

        // Prevent setting self as parent
        if (data.parentId === categoryId) {
            throw new ApiError("A category cannot be its own parent", 400);
        }

        // Validate parentId (if provided)
        if (data.parentId && !Types.ObjectId.isValid(data.parentId)) {
            throw new ApiError("Invalid parentId", 400);
        }

        return RepositoryProvider.categoryRepository.update(categoryId, data);
    }

    /**
     * ✅ Delete category (soft delete by default)
     */
    async deleteCategory(categoryId: string, soft: boolean = true): Promise<boolean> {
        const existing = await RepositoryProvider.categoryRepository.findById(categoryId);
        if (!existing) throw new ApiError("Category not found", 404);

        // Soft delete children recursively
        if (soft) {
            const children = await RepositoryProvider.categoryRepository.findAll({ parentId: categoryId });
            for (const child of children) {
                await RepositoryProvider.categoryRepository.update(child.id, { isActive: false });
            }
        }

        return RepositoryProvider.categoryRepository.delete(categoryId, soft);
    }

    /**
    * ✅ Increment post count when a blog is added under this category
    * @param categoryId - The ID of the category
    */
    async incrementPostCount(categoryId: string): Promise<void> {
        const existing = await RepositoryProvider.categoryRepository.findById(categoryId);
        if (!existing) throw new ApiError("Category not found", 404);

        await RepositoryProvider.categoryRepository.incrementPostCount(categoryId);
    }

    /**
     * ✅ Decrement post count when a blog is removed from this category
     * @param categoryId - The ID of the category
     */
    async decrementPostCount(categoryId: string): Promise<void> {
        const existing = await RepositoryProvider.categoryRepository.findById(categoryId);
        if (!existing) throw new ApiError("Category not found", 404);

        await RepositoryProvider.categoryRepository.decrementPostCount(categoryId);
    }
}
