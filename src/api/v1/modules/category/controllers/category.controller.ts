import { Request, Response } from "express";
import { ServiceProvider } from "../../../ServiceProvider";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ICategoryController } from "./category.controller.interface";
import { ICategoryEntity } from "../models/category.entity";
import { ICreateCategory, IUpdateCategory } from "../models/category.dto";

export class CategoryController implements ICategoryController {
    // ✅ Get all categories with optional filters
    async getAll(req: Request, res: Response): Promise<Response> {
        const filter = req.query as Partial<ICategoryEntity>;
        const categories = await ServiceProvider.categoryService.getCategories(filter);
        return ApiResponse.success(res, "Categories fetched successfully", categories);
    }

    // ✅ Get category by ID
    async getById(req: Request, res: Response): Promise<Response> {
        const category = await ServiceProvider.categoryService.getCategoryById(req.params.id);
        return ApiResponse.success(res, "Category fetched successfully", category);
    }

    // ✅ Create a new category
    async create(req: Request, res: Response): Promise<Response> {
        const categoryData: ICreateCategory = req.body;
        const category = await ServiceProvider.categoryService.createCategory(categoryData, req.file!);
        return ApiResponse.success(res, "Category created successfully", category, 201);
    }

    // ✅ Update category
    async update(req: Request, res: Response): Promise<Response> {
        const categoryData: IUpdateCategory = req.body;
        const category = await ServiceProvider.categoryService.updateCategory(req.params.id, categoryData, req.file!);
        return ApiResponse.success(res, "Category updated successfully", category);
    }

    // ✅ Delete category (soft delete by default)
    async delete(req: Request, res: Response): Promise<Response> {
        const softDelete = req.query.soft !== "false"; // default true
        const result = await ServiceProvider.categoryService.deleteCategory(req.params.id, softDelete);
        return ApiResponse.success(res, "Category deleted successfully", null, result ? 200 : 404);
    }
}
