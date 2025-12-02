// src/controllers/blog.controller.interface.ts
import { Request, Response } from "express";

export interface IBlogController {
    create(req: Request, res: Response): Promise<Response>;
    getAll(req: Request, res: Response): Promise<Response>;
    getOne(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
    incrementViewCount(req: Request, res: Response): Promise<Response>;
    addLike(req: Request, res: Response): Promise<Response>;
    removeLike(req: Request, res: Response): Promise<Response>;
    schedule(req: Request, res: Response): Promise<Response>;
    publish(req: Request, res: Response): Promise<Response>;
    archive(req: Request, res: Response): Promise<Response>;
}
