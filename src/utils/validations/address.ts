import { z } from "zod"

export const addressSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(100, { message: "First name must be at most 100 characters" })
    .nonempty({ message: "First name is required" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(100, { message: "Last name must be at most 100 characters" })
    .nonempty({ message: "Last name is required" }),
  company: z.string().optional(),
  address_1: z
    .string()
    .min(5, { message: "Address line 1 must be at least 5 characters" })
    .max(200, { message: "Address line 1 must be at most 200 characters" })
    .nonempty({ message: "Address line 1 is required" }),
  address_2: z.string().optional(),
  postal_code: z
    .string()
    .min(3, { message: "Postal code must be at least 3 characters" })
    .max(12, { message: "Postal code must be at most 12 characters" })
    .nonempty({ message: "Postal code is required" }),
  province: z
    .string()
    .min(2, { message: "Province must be at least 2 characters" })
    .max(100, { message: "Province must be at most 100 characters" })
    .nonempty({ message: "Province is required" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters" })
    .max(100, { message: "City must be at most 100 characters" })
    .nonempty({ message: "City is required" }),
  country_code: z
    .string()
    .min(1, { message: "Country code must be at least 2 characters" })
    .max(30, { message: "Country code must be at most 30 characters" }),
  phone: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits" })
    .max(20, { message: "Phone number must be at most 20 digits" })
    .nonempty({ message: "Phone number is required" }),
})

export type AddressFormType = z.infer<typeof addressSchema>
