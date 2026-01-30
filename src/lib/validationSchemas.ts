import { z } from 'zod';

// Register validation schema matching the Mongoose user schema
export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores'
        )
        .trim(),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
});

// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, 'Password is required')
});

// Export types for TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Content Upload validation schemas
export const fileUploadSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    type: z.literal('file')
});

export const textContentSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    content: z
        .string()
        .min(1, 'Content is required')
        .max(10000, 'Content cannot exceed 10000 characters'),
    type: z.literal('text')
});

// Export types for content
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type TextContentData = z.infer<typeof textContentSchema>;
