import { Request, Response } from "express";

export interface ICategoryController {
    /**
     * Get all categories with optional filters from query
     */
    getAll(req: Request, res: Response): Promise<Response>;

    /**
     * Get a single category by ID
     */
    getById(req: Request, res: Response): Promise<Response>;

    /**
     * Create a new category
     * @param req.body - Category creation data
     */
    create(req: Request, res: Response): Promise<Response>;

    /**
     * Update an existing category by ID
     * @param req.body - Partial update data
     */
    update(req: Request, res: Response): Promise<Response>;

    /**
     * Delete a category by ID (soft delete by default)
     * @param req.query.soft - optional query to perform hard delete
     */
    delete(req: Request, res: Response): Promise<Response>;
}
