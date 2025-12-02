// src/modules/categories/repositories/mongoCategory.repository.ts
import { Types } from "mongoose";
import { ICategoryRepository } from "./category.repository.interface";
import { ICategoryEntity } from "../models/category.entity";
import { Category, ICategoryMongo } from "../models/mongoCategory.entity";

export class MongoCategoryRepository implements ICategoryRepository {
    /**
     * Create a new category (pure DB write)
     */
    async create(data: Partial<ICategoryEntity>): Promise<ICategoryEntity> {
        const created = await Category.create({
            ...data,
            parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
        });
        return this.toEntity(created);
    }

    /**
     * Find category by ID
     */
    async findById(id: string): Promise<ICategoryEntity | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await Category.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }

    /**
     * Find category by slug
     */
    async findBySlug(slug: string): Promise<ICategoryEntity | null> {
        const doc = await Category.findOne({ slug }).exec();
        return doc ? this.toEntity(doc) : null;
    }

    /**
     * Find all categories with optional filters
     */
    async findAll(filter?: Partial<ICategoryEntity>): Promise<ICategoryEntity[]> {
        const query: Record<string, any> = {};

        if (filter?.name) query.name = { $regex: filter.name, $options: "i" };
        if (filter?.slug) query.slug = filter.slug;
        if (filter?.parentId) query.parentId = filter.parentId;
        if (filter?.isActive !== undefined) query.isActive = filter.isActive;

        const docs = await Category.find(query).sort({ createdAt: -1 }).exec();
        return docs.map(this.toEntity);
    }

    /**
     * Update category by ID
     */
    async update(id: string, data: Partial<ICategoryEntity>): Promise<ICategoryEntity | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const updated = await Category.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).exec();

        return updated ? this.toEntity(updated) : null;
    }

    /**
     * Delete category (soft delete by default)
     */
    async delete(id: string, soft: boolean = true): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;

        if (soft) {
            const res = await Category.findByIdAndUpdate(id, { isActive: false }).exec();
            return !!res;
        }

        const res = await Category.findByIdAndDelete(id).exec();
        return !!res;
    }

    /**
  * Increment the post count for a category
  * @param categoryId - ID of the category
  */
    async incrementPostCount(categoryId: string): Promise<void> {
        await Category.findByIdAndUpdate(categoryId, { $inc: { postCount: 1 } });
    }

    /**
     * Decrement the post count for a category
     * @param categoryId - ID of the category
     */
    async decrementPostCount(categoryId: string): Promise<void> {
        await Category.findByIdAndUpdate(categoryId, { $inc: { postCount: -1 } });
    }

    /**
     * Convert MongoDB document → Entity
     */
    private toEntity(doc: ICategoryMongo): ICategoryEntity {
        return {
            id: doc._id.toString(),
            name: doc.name,
            slug: doc.slug,
            description: doc.description,
            icon: doc.icon,
            color: doc.color,
            parentId: doc.parentId ? doc.parentId.toString() : null,
            postCount: doc.postCount ?? 0,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
