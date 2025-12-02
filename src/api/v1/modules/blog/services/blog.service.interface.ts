import { IBlogQueryOptions } from "../models/blog.dto";
import { IBlogPostEntity } from "../models/blog.entity";

export interface IBlogService {
    /**
     * Create a new blog post
     * @param post - Blog data
     * @returns Created blog post entity
     */
    create(post: Partial<IBlogPostEntity>): Promise<IBlogPostEntity>;

    /**
     * Get a single blog post by ID or slug
     * @param idOrSlug - Blog ID or slug
     * @param includeDrafts - Whether to include draft posts
     */
    getOne(idOrSlug: string, includeDrafts?: boolean): Promise<IBlogPostEntity | null>;

    /**
     * Get multiple blog posts with optional filters
     * @param filters - Filter by status, category, author, tags, visibility, date, etc.
     * @param skip - Pagination skip
     * @param limit - Pagination limit
     */
    getAll(filters?: IBlogQueryOptions): Promise<IBlogPostEntity[]>;

    /**
     * Update a blog post by ID
     * @param id - Blog post ID
     * @param updateData - Partial blog post data to update
     */
    update(id: string, updateData: Partial<IBlogPostEntity>): Promise<IBlogPostEntity | null>;

    /**
     * Delete a blog post by ID
     * @param id - Blog post ID
     */
    delete(id: string): Promise<boolean>;

    /**
     * Increment view count
     * @param id - Blog post ID
     */
    incrementViewCount(id: string): Promise<void>;

    /**
     * Add a like to a blog post
     * @param postId - Blog post ID
     * @param userId - User ID
     */
    addLike(postId: string, userId: string): Promise<void>;

    /**
     * Remove a like from a blog post
     * @param postId - Blog post ID
     * @param userId - User ID
     */
    removeLike(postId: string, userId: string): Promise<void>;

    /**
     * Schedule a blog post to be published at a future date
     * @param postId - Blog post ID
     * @param publishDate - Date to publish
     */
    schedule(postId: string, publishDate: Date): Promise<IBlogPostEntity | null>;

    /**
     * Publish a draft or scheduled blog post immediately
     * @param postId - Blog post ID
     */
    publish(postId: string): Promise<IBlogPostEntity | null>;

    /**
     * Archive a blog post
     * @param postId - Blog post ID
     */
    archive(postId: string): Promise<IBlogPostEntity | null>;
}
