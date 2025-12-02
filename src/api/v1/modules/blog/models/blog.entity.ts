
/** Enum for blog post status */
export enum IBlogPostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived",
    SCHEDULED = "scheduled",
}

/** Enum for blog post visibility */
export enum IBlogPostVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    UNLISTED = "unlisted",
}

/** Featured image structure */
export interface IFeaturedImage {
    url: string;
    alt?: string;
    caption?: string;
}

/** Like structure */
export interface IBlogLike {
    user: string; // user id
    likedAt: Date;
}

/** SEO structure */
export interface IBlogSEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
}

/** Blog post entity interface */
export interface IBlogPostEntity {
    id: string; // _id or primary key
    title: string; // 10–200 characters
    slug: string; // unique URL-friendly identifier
    content: string; // minimum 100 characters
    excerpt?: string; // optional, max 300 characters // summary of the post or preview text 
    author: string; // user id 
    category: string; // category id
    tags: string[]; // lowercase
    featuredImage?: IFeaturedImage;
    status: IBlogPostStatus;
    visibility: IBlogPostVisibility;
    viewCount: number;
    likes: IBlogLike[];
    readTime: number; // in minutes
    seo?: IBlogSEO;
    publishedAt?: Date;
    scheduledFor?: Date;
    createdAt: Date;
    updatedAt: Date;
}
