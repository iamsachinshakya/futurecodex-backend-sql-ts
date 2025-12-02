import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ControllerProvider } from "../../../ControllerProvider";
import { validateBody, validateFileSchema } from "../../../common/middlewares/validate.middleware";
import { uploadSingle } from "../../../common/middlewares/upload.middleware";
import { imageSchema, updateUserSchema, socialLinksSchema, userPreferencesSchema } from "../validations/user.validation";
import { authenticateJWT } from "../../auth/middlewares/auth.middleware";
import { requirePermission } from "../../auth/middlewares/requirePermission";
import { PERMISSIONS } from "../../auth/constants/auth.constant";
import { registerUserSchema } from "../../auth/validations/auth.validation";

export const userRouter = Router();
const userController = ControllerProvider.userController;

/**
 * @route   POST /api/v1/users
 * @desc    Create user 
 * @access  Private
 */
userRouter.post(
  "/",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.CREATE),
  validateBody(registerUserSchema),
  asyncHandler(userController.createUser.bind(userController))
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
userRouter.get(
  "/",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getAll.bind(userController))
);


/**
 * @route   PATCH /api/v1/users/update-account
 * @desc    Update user profile details (name, email, etc.)
 * @access  Private
 */
userRouter.patch(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  validateBody(updateUserSchema),
  asyncHandler(userController.updateAccountDetails.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
userRouter.patch(
  "/:id/avatar",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  uploadSingle("avatar"),
  validateFileSchema(imageSchema),
  asyncHandler(userController.updateAvatar.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/social-links
 * @desc    Update user's social links (GitHub, LinkedIn, Twitter, etc.)
 * @access  Private
 */
userRouter.patch(
  "/social-links",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  validateBody(socialLinksSchema),
  asyncHandler(userController.updateSocialLinks.bind(userController))
);

/**
 * @route   POST /api/v1/users/follow/:targetUserId
 * @desc    Follow another user
 * @access  Private
 */
userRouter.post(
  "/follow/:targetUserId",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  asyncHandler(userController.followUser.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/unfollow/:targetUserId
 * @desc    Unfollow a user
 * @access  Private
 */
userRouter.delete(
  "/unfollow/:targetUserId",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  asyncHandler(userController.unfollowUser.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id/followers
 * @desc    Get all followers of a user
 * @access  Private
 */
userRouter.get(
  "/:id/followers",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getFollowers.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id/following
 * @desc    Get all users followed by this user
 * @access  Private
 */
userRouter.get(
  "/:id/following",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getFollowing.bind(userController))
);

/**
 * @route   PATCH /api/v1/users/preferences
 * @desc    Update user preferences (theme, notifications, etc.)
 * @access  Private
 */
userRouter.patch(
  "/preferences",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.UPDATE),
  validateBody(userPreferencesSchema),
  asyncHandler(userController.updatePreferences.bind(userController))
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
userRouter.get(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.READ),
  asyncHandler(userController.getById.bind(userController))
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
userRouter.delete(
  "/:id",
  authenticateJWT,
  requirePermission(PERMISSIONS.USER.DELETE),
  asyncHandler(userController.delete.bind(userController))
);

export default userRouter;
