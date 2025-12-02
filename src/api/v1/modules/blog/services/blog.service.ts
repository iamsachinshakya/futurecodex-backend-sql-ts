import slugify from "slugify";
import { ApiError } from "../../../common/utils/apiError";
import { RepositoryProvider } from "../../../RepositoryProvider";

import { IBlogService } from "../services/blog.service.interface";
import { IBlogPostEntity, IBlogPostStatus, IBlogPostVisibility } from "../models/blog.entity";
import { IBlogQueryOptions } from "../models/blog.dto";

export class BlogService implements IBlogService {
    // ✅ Create a new blog post
    async create(post: Partial<IBlogPostEntity>): Promise<IBlogPostEntity> {
        if (!post.title || !post.content) {
            throw new ApiError("Title and content are required", 400);
        }

        post.slug =
            post.slug || slugify(post.title, { lower: true, strict: true });
        post.status = post.status || IBlogPostStatus.DRAFT;
        post.visibility = post.visibility || IBlogPostVisibility.PUBLIC;

        const created = await RepositoryProvider.blogRepository.create(post);
        if (!created) throw new ApiError("Failed to create blog post", 500);

        return created;
    }

    // ✅ Get single blog post by ID or slug
    async getOne(
        idOrSlug: string,
        includeDrafts = false
    ): Promise<IBlogPostEntity | null> {
        let blog: IBlogPostEntity | null = null;

        // Detect whether input is likely an ObjectId or a slug
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

        if (isObjectId) {
            blog = await RepositoryProvider.blogRepository.findById(idOrSlug);
        } else {
            blog = await RepositoryProvider.blogRepository.findBySlug(idOrSlug);
        }

        if (!blog) throw new ApiError("Blog post not found", 404);

        // If drafts should be hidden and it's a draft
        if (!includeDrafts && blog.status === IBlogPostStatus.DRAFT) {
            throw new ApiError("Blog post is not published", 403);
        }

        return blog;
    }

    // ✅ Get all blog posts with optional filters
    async getAll(options?: IBlogQueryOptions): Promise<IBlogPostEntity[]> {
        const blogs = await RepositoryProvider.blogRepository.findAll(options);
        if (!blogs || blogs.length === 0)
            throw new ApiError("No blog posts found", 404);
        return blogs;
    }

    // ✅ Update blog post
    async update(
        id: string,
        updateData: Partial<IBlogPostEntity>
    ): Promise<IBlogPostEntity | null> {
        const existing = await RepositoryProvider.blogRepository.findById(id);
        if (!existing) throw new ApiError("Blog post not found", 404);

        const updated = await RepositoryProvider.blogRepository.updateById(
            id,
            updateData
        );
        if (!updated) throw new ApiError("Failed to update blog post", 500);

        return updated;
    }

    // ✅ Delete blog post
    async delete(id: string): Promise<boolean> {
        const deleted = await RepositoryProvider.blogRepository.deleteById(id);
        if (!deleted) throw new ApiError("Blog post not found", 404);
        return true;
    }

    // ✅ Increment view count
    async incrementViewCount(id: string): Promise<void> {
        const post = await RepositoryProvider.blogRepository.findById(id);
        if (!post) throw new ApiError("Blog post not found", 404);

        await RepositoryProvider.blogRepository.incrementViewCount(id);
    }

    // ✅ Add like
    async addLike(postId: string, userId: string): Promise<void> {
        const post = await RepositoryProvider.blogRepository.findById(postId);
        if (!post) throw new ApiError("Blog post not found", 404);

        // Delegating logic to repository, assume it handles uniqueness
        await RepositoryProvider.blogRepository.addLike(postId, userId);
    }

    // ✅ Remove like
    async removeLike(postId: string, userId: string): Promise<void> {
        const post = await RepositoryProvider.blogRepository.findById(postId);
        if (!post) throw new ApiError("Blog post not found", 404);

        await RepositoryProvider.blogRepository.removeLike(postId, userId);
    }

    // ✅ Schedule blog post
    async schedule(
        postId: string,
        publishDate: Date
    ): Promise<IBlogPostEntity | null> {
        const post = await RepositoryProvider.blogRepository.findById(postId);
        if (!post) throw new ApiError("Blog post not found", 404);

        if (publishDate <= new Date()) {
            throw new ApiError("Publish date must be in the future", 400);
        }

        const scheduled = await RepositoryProvider.blogRepository.schedule(
            postId,
            publishDate
        );

        if (!scheduled) throw new ApiError("Failed to schedule blog post", 500);
        return scheduled;
    }

    // ✅ Publish immediately
    async publish(postId: string): Promise<IBlogPostEntity | null> {
        const post = await RepositoryProvider.blogRepository.findById(postId);
        if (!post) throw new ApiError("Blog post not found", 404);

        if (post.status === IBlogPostStatus.PUBLISHED) {
            throw new ApiError("Blog post is already published", 400);
        }

        const published = await RepositoryProvider.blogRepository.publish(postId);

        if (!published) throw new ApiError("Failed to publish blog post", 500);
        return published;
    }

    // ✅ Archive blog post
    async archive(postId: string): Promise<IBlogPostEntity | null> {
        const post = await RepositoryProvider.blogRepository.findById(postId);
        if (!post) throw new ApiError("Blog post not found", 404);

        const archived = await RepositoryProvider.blogRepository.archive(postId);
        if (!archived) throw new ApiError("Failed to archive blog post", 500);
        return archived;
    }
}
