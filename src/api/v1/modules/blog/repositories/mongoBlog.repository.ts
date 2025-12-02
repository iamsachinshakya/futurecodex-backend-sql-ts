import { SortOrder, Types } from "mongoose";
import { IBlogRepository } from "./blog.repository.interface";
import { IBlogPostEntity, IBlogPostStatus } from "../models/blog.entity";
import { Blog } from "../models/mongoBlog.entity";
import { IBlogQueryOptions } from "../models/blog.dto";

export class MongoBlogRepository implements IBlogRepository {
    async create(data: Partial<IBlogPostEntity>): Promise<IBlogPostEntity> {
        const blog = await Blog.create(data);
        return this.toEntity(blog);
    }

    async findById(id: string): Promise<IBlogPostEntity | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const blog = await Blog.findById(id);
        return blog ? this.toEntity(blog) : null;
    }

    async findBySlug(slug: string): Promise<IBlogPostEntity | null> {
        const blog = await Blog.findOne({ slug });
        return blog ? this.toEntity(blog) : null;
    }

    async findAll(options?: IBlogQueryOptions): Promise<IBlogPostEntity[]> {
        const query: any = {};
        if (options?.filters) {
            const f = options.filters;
            if (f.authorId) query.author = f.authorId;
            if (f.categoryId) query.category = f.categoryId;
            if (f.status) query.status = f.status;
            if (f.visibility) query.visibility = f.visibility;
            if (f.tags) query.tags = { $in: f.tags };
            if (f.publishedBefore) query.publishedAt = { ...query.publishedAt, $lte: f.publishedBefore };
            if (f.publishedAfter) query.publishedAt = { ...query.publishedAt, $gte: f.publishedAfter };
        }

        const skip = options?.skip ?? 0;
        const limit = options?.limit ?? 20;

        const blogs = await Blog.find(query).skip(skip).limit(limit).sort({ publishedAt: -1 } as Record<string, SortOrder>);
        return blogs.map((b) => this.toEntity(b));
    }

    async updateById(id: string, data: Partial<IBlogPostEntity>): Promise<IBlogPostEntity | null> {
        const updated = await Blog.findByIdAndUpdate(id, data, { new: true });
        return updated ? this.toEntity(updated) : null;
    }

    async deleteById(id: string): Promise<IBlogPostEntity | null> {
        const deleted = await Blog.findByIdAndDelete(id);
        return deleted ? this.toEntity(deleted) : null;
    }

    async incrementViewCount(id: string): Promise<void> {
        await Blog.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    async addLike(postId: string, userId: string): Promise<void> {
        await Blog.updateOne(
            { _id: postId, "likes.user": { $ne: userId } },
            { $push: { likes: { user: userId, likedAt: new Date() } } }
        );
    }

    async removeLike(postId: string, userId: string): Promise<void> {
        await Blog.updateOne(
            { _id: postId },
            { $pull: { likes: { user: userId } } }
        );
    }

    async schedule(postId: string, publishDate: Date): Promise<IBlogPostEntity | null> {
        return this.updateById(postId, { scheduledFor: publishDate, status: IBlogPostStatus.DRAFT });
    }

    async publish(postId: string): Promise<IBlogPostEntity | null> {
        return this.updateById(postId, { status: IBlogPostStatus.PUBLISHED, publishedAt: new Date(), scheduledFor: undefined });
    }

    async archive(postId: string): Promise<IBlogPostEntity | null> {
        return this.updateById(postId, { status: IBlogPostStatus.ARCHIVED });
    }

    private toEntity(blogDoc: any): IBlogPostEntity {
        const obj = blogDoc.toObject ? blogDoc.toObject() : blogDoc;

        return {
            id: obj._id?.toString(),
            title: obj.title,
            slug: obj.slug,
            content: obj.content,
            excerpt: obj.excerpt,
            author: obj.author,
            category: obj.category,
            tags: obj.tags || [],
            featuredImage: obj.featuredImage || null,
            status: obj.status,
            visibility: obj.visibility,
            viewCount: obj.viewCount || 0,
            likes: obj.likes?.map((l: any) => ({ user: l.user.toString(), likedAt: l.likedAt })) || [],
            readTime: obj.readTime || 0,
            seo: obj.seo || null,
            publishedAt: obj.publishedAt || null,
            scheduledFor: obj.scheduledFor || null,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
        };
    }
}
