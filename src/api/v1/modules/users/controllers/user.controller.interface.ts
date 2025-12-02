import { Request, Response } from "express";

export interface IUserController {

    /**
     * Create user by admin
     * @route Post /api/v1/users
     * @access Private (Admin only)
     */
    createUser(req: Request, res: Response): Promise<Response>

    /**
     * Get all users
     * @route GET /api/v1/users
     * @access Private (Admin only)
     */
    getAll(req: Request, res: Response): Promise<Response>;

    /**
     * Get user by ID
     * @route GET /api/v1/users/:id
     * @access Private (Admin or self)
     */
    getById(req: Request, res: Response): Promise<Response>;

    /**
     * Update account details (name, email, bio, etc.)
     * @route PATCH /api/v1/users/update-account
     * @access Private
     */
    updateAccountDetails(req: Request, res: Response): Promise<Response>;

    /**
     * Update user avatar
     * @route PATCH /api/v1/users/avatar
     * @access Private
     */
    updateAvatar(req: Request, res: Response): Promise<Response>;

    /**
     * Delete a user (soft or hard delete)
     * @route DELETE /api/v1/users/:id
     * @access Private (Admin only)
     */
    delete(req: Request, res: Response): Promise<Response>;

    /**
     * Add or update social links (GitHub, LinkedIn, Twitter, etc.)
     * @route PATCH /api/v1/users/social-links
     * @access Private
     */
    updateSocialLinks(req: Request, res: Response): Promise<Response>;

    /**
     * Follow another user
     * @route POST /api/v1/users/follow/:targetUserId
     * @access Private
     */
    followUser(req: Request, res: Response): Promise<Response>;

    /**
     * Unfollow another user
     * @route DELETE /api/v1/users/unfollow/:targetUserId
     * @access Private
     */
    unfollowUser(req: Request, res: Response): Promise<Response>;

    /**
     * Get all followers of a user
     * @route GET /api/v1/users/:id/followers
     * @access Private
     */
    getFollowers(req: Request, res: Response): Promise<Response>;

    /**
     * Get all users the given user is following
     * @route GET /api/v1/users/:id/following
     * @access Private
     */
    getFollowing(req: Request, res: Response): Promise<Response>;

    /**
     * Update user preferences (theme, notifications, reading mode, etc.)
     * @route PATCH /api/v1/users/preferences
     * @access Private
     */
    updatePreferences(req: Request, res: Response): Promise<Response>;

    /**
     * Get user preferences
     * @route GET /api/v1/users/preferences
     * @access Private
     */
    getPreferences(req: Request, res: Response): Promise<Response>;
}
