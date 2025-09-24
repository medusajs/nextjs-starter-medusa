import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be at most 30 characters"),
})

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be at most 100 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be at most 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be at most 30 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),
})

export const updateProfileNameSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be at most 100 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be at most 100 characters"),
})

export const updateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const updatePhoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),
})

export const updatePasswordSchema = z
  .object({
    old_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
  })
  .refine(
    ({ new_password, confirm_password }) => new_password === confirm_password,
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  )

export type LoginFormType = z.infer<typeof loginSchema>
export type RegisterFormType = z.infer<typeof registerSchema>
export type UpdateProfileNameFormType = z.infer<typeof updateProfileNameSchema>
export type UpdateEmailFormType = z.infer<typeof updateEmailSchema>
export type UpdatePhoneFormType = z.infer<typeof updatePhoneSchema>
export type UpdatePasswordFormType = z.infer<typeof updatePasswordSchema>
