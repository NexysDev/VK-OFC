import { z } from 'zod'

// Product Schema
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  size: z.array(z.string()).min(1),
  color: z.array(z.string()).min(1),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0),
  createdAt: z.date()
})

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true })

// Category Schema
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional()
})

export const insertCategorySchema = categorySchema.omit({ id: true })

// Admin User Schema
export const adminUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  passwordHash: z.string(),
  createdAt: z.date()
})

export const insertAdminUserSchema = adminUserSchema.omit({ id: true, createdAt: true, passwordHash: true }).extend({
  password: z.string().min(6)
})