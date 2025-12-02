import { z } from "zod";
import { UserRole, UserStatus } from "../models/user.entity";

/**
 * Schema: Update User
 * - All fields optional (for partial updates)
 * - Includes nested preferences validation
 */
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be at most 50 characters long")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional(),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
    .optional(),

  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters long")
    .optional(),

  status: z.enum(UserStatus).optional(),

  role: z.enum(UserRole).optional(),

})
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== null),
    {
      message: "At least one field must be provided for update.",
      path: [],
    }
  );


export const imageSchema = z.object({
  file: z
    .any()
    .refine((file: Express.Multer.File | undefined) => !!file, {
      message: "Avatar file is required",
    })
    .refine((file: Express.Multer.File | undefined) => {
      if (!file) return false;
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      return allowedMimeTypes.includes(file.mimetype);
    }, {
      message: "Invalid file type. Allowed types: jpeg, png, webp, gif",
    })
    .refine((file: Express.Multer.File | undefined) => {
      if (!file) return false;
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      return file.size <= maxSizeInBytes;
    }, {
      message: "File size must not exceed 5 MB",
    }),
});



// Social links schema
export const socialLinksSchema = z
  .object({
    github: z.url().nullable().optional(),
    linkedin: z.url().nullable().optional(),
    twitter: z.url().nullable().optional(),
    website: z.url().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== null && value !== undefined && value !== ""), {
    message: "At least one social link must be provided",
  });

// User preferences schema
export const userPreferencesSchema = z
  .object({
    emailNotifications: z.boolean().optional(),
    marketingUpdates: z.boolean().optional(),
    twoFactorAuth: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one preference must be provided",
  });
