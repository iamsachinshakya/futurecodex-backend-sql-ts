// src/controllers/blog.controller.ts
import { Request, Response } from "express";
import { ApiResponse } from "../../../common/utils/apiResponse";
import { ServiceProvider } from "../../../ServiceProvider";
import { IBlogController } from "./blog.controller.interface";
import { IBlogPostEntity } from "../models/blog.entity";
import { IBlogQueryOptions } from "../models/blog.dto";

export class BlogController implements IBlogController {
    // ✅ Create a new blog post
    async create(req: Request, res: Response): Promise<Response> {
        const postData: Partial<IBlogPostEntity> = req.body;
        const blog = await ServiceProvider.blogService.create(postData);
        return ApiResponse.success(res, "Blog post created successfully", blog, 201);
    }

    // ✅ Get all blog posts with filters
    async getAll(req: Request, res: Response): Promise<Response> {
        const options: IBlogQueryOptions = {
            filters: {
                authorId: req.query.authorId as string,
                categoryId: req.query.categoryId as string,
                status: req.query.status as any,
                visibility: req.query.visibility as any,
                tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
                publishedBefore: req.query.publishedBefore ? new Date(req.query.publishedBefore as string) : undefined,
                publishedAfter: req.query.publishedAfter ? new Date(req.query.publishedAfter as string) : undefined,
            },
            skip: req.query.skip ? parseInt(req.query.skip as string, 10) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        };

        const blogs = await ServiceProvider.blogService.getAll(options);
        return ApiResponse.success(res, "Blog posts fetched successfully", blogs);
    }

    // ✅ Get a single blog post by ID or slug
    async getOne(req: Request, res: Response): Promise<Response> {
        const { idOrSlug } = req.params;
        const includeDrafts = req.query.includeDrafts === "true";
        const blog = await ServiceProvider.blogService.getOne(idOrSlug, includeDrafts);

        if (!blog) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post fetched successfully", blog);
    }

    // ✅ Update a blog post
    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updateData: Partial<IBlogPostEntity> = req.body;
        const updated = await ServiceProvider.blogService.update(id, updateData);

        if (!updated) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post updated successfully", updated);
    }

    // ✅ Delete a blog post
    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const deleted = await ServiceProvider.blogService.delete(id);

        if (!deleted) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post deleted successfully", null, 204);
    }

    // ✅ Increment view count
    async incrementViewCount(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        await ServiceProvider.blogService.incrementViewCount(id);
        return ApiResponse.success(res, "View count incremented successfully", null, 204);
    }

    // ✅ Add like
    async addLike(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const { userId } = req.body;
        await ServiceProvider.blogService.addLike(postId, userId);
        return ApiResponse.success(res, "Like added successfully", null, 204);
    }

    // ✅ Remove like
    async removeLike(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const { userId } = req.body;
        await ServiceProvider.blogService.removeLike(postId, userId);
        return ApiResponse.success(res, "Like removed successfully", null, 204);
    }

    // ✅ Schedule blog post
    async schedule(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const { publishDate } = req.body;
        const scheduled = await ServiceProvider.blogService.schedule(postId, new Date(publishDate));

        if (!scheduled) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post scheduled successfully", scheduled);
    }

    // ✅ Publish blog post immediately
    async publish(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const published = await ServiceProvider.blogService.publish(postId);

        if (!published) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post published successfully", published);
    }

    // ✅ Archive blog post
    async archive(req: Request, res: Response): Promise<Response> {
        const { postId } = req.params;
        const archived = await ServiceProvider.blogService.archive(postId);

        if (!archived) return ApiResponse.error(res, "Blog post not found", 404);
        return ApiResponse.success(res, "Blog post archived successfully", archived);
    }
}
