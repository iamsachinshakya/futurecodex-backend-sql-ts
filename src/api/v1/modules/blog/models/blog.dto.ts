import { IBlogPostStatus, IBlogPostVisibility } from "./blog.entity";

/**
 * Filters and pagination options for fetching blog posts
 */
export interface IBlogQueryOptions {
    /** Optional filters */
    filters?: {
        authorId?: string;             // Filter by author ID
        categoryId?: string;           // Filter by category ID
        status?: IBlogPostStatus;       // Filter by post status
        visibility?: IBlogPostVisibility; // Filter by visibility
        tags?: string[];               // Filter by tags (array)
        publishedBefore?: Date;        // Filter posts published before this date
        publishedAfter?: Date;         // Filter posts published after this date
    };

    /** Pagination: number of items to skip */
    skip?: number;

    /** Pagination: maximum number of items to return */
    limit?: number;
}
