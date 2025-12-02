import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { ControllerProvider } from "../../../ControllerProvider";
import {
    validateBody,
    validateQuery,
} from "../../../common/middlewares/validate.middleware";
import { authenticateJWT } from "../../auth/middlewares/auth.middleware";
import { requirePermission } from "../../auth/middlewares/requirePermission";
import { PERMISSIONS } from "../../auth/constants/auth.constant";
import {
    createCommentSchema,
    updateCommentSchema,
    queryCommentsSchema,
} from "../validations/comment.validation";

export const commentRouter = Router();
const commentController = ControllerProvider.commentController;

/**
 * @route   GET /api/v1/comments
 * @desc    Get all comments for a post (optionally include nested replies)
 * @access  Private (Requires comment:read permission)
 */
commentRouter.get(
    "/",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.READ),
    validateQuery(queryCommentsSchema),
    asyncHandler(commentController.getCommentsByPost.bind(commentController))
);

/**
 * @route   GET /api/v1/comments/:id
 * @desc    Get a single comment by ID
 * @access  Private (Requires comment:read permission)
 */
commentRouter.get(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.READ),
    asyncHandler(commentController.getCommentById.bind(commentController))
);

/**
 * @route   POST /api/v1/comments
 * @desc    Create a new comment or reply
 * @access  Private (Requires comment:create permission)
 */
commentRouter.post(
    "/",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.CREATE),
    validateBody(createCommentSchema),
    asyncHandler(commentController.createComment.bind(commentController))
);

/**
 * @route   PATCH /api/v1/comments/:id
 * @desc    Update comment content
 * @access  Private (Requires comment:update permission)
 */
commentRouter.patch(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.UPDATE),
    validateBody(updateCommentSchema),
    asyncHandler(commentController.updateComment.bind(commentController))
);

/**
 * @route   DELETE /api/v1/comments/:id
 * @desc    Soft delete comment (can pass ?soft=false for hard delete)
 * @access  Private (Requires comment:delete permission)
 */
commentRouter.delete(
    "/:id",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.DELETE),
    asyncHandler(commentController.deleteComment.bind(commentController))
);

/**
 * @route   POST /api/v1/comments/:id/like
 * @desc    Like a comment
 * @access  Private (Requires comment:like permission)
 */
commentRouter.post(
    "/:id/like",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.LIKE),
    asyncHandler(commentController.likeComment.bind(commentController))
);

/**
 * @route   POST /api/v1/comments/:id/unlike
 * @desc    Remove like from a comment
 * @access  Private (Requires comment:like permission)
 */
commentRouter.post(
    "/:id/unlike",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.LIKE),
    asyncHandler(commentController.unlikeComment.bind(commentController))
);

/**
 * @route   GET /api/v1/comments/:id/replies
 * @desc    Get all replies for a specific comment
 * @access  Private (Requires comment:read permission)
 */
commentRouter.get(
    "/:id/replies",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.READ),
    asyncHandler(commentController.getReplies.bind(commentController))
);

/**
 * @route   GET /api/v1/comments/:id/likes/count
 * @desc    Count total likes of a comment
 * @access  Private (Requires comment:read permission)
 */
commentRouter.get(
    "/:id/likes/count",
    authenticateJWT,
    requirePermission(PERMISSIONS.COMMENT.READ),
    asyncHandler(commentController.countLikes.bind(commentController))
);

export default commentRouter;
