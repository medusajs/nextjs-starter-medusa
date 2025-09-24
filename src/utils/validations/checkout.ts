import { z } from "zod"

const billingAddressSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  company: z.string().optional(),
  address_1: z.string().min(5).max(200),
  postal_code: z.string().min(3).max(12),
  province: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  country_code: z.string().min(1).max(30),
  phone: z.string().min(7).max(20),
})

const shippingAddressSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  company: z.string().optional(),
  address_1: z.string().min(5).max(200),
  postal_code: z.string().min(3).max(12),
  province: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  country_code: z.string().min(1).max(30),
  phone: z.string().min(7).max(20),
})

export const addressSchema = z.discriminatedUnion("same_as_billing", [
  z.object({
    same_as_billing: z.literal(false),
    billing_address: billingAddressSchema,
    shipping_address: shippingAddressSchema,
    email: z.string().email("Invalid email address"),
  }),

  z.object({
    same_as_billing: z.literal(true),
    billing_address: z.optional(billingAddressSchema),
    shipping_address: shippingAddressSchema,
    email: z.string().email("Invalid email address"),
  }),
])

export type AddressFormType = z.infer<typeof addressSchema>
