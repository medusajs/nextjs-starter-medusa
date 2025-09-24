import { z } from "zod"

export const transferOrderSchema = z.object({
  id: z
    .string()
    .min(1, "Order id must be at least 1 characters")
    .max(100, "Order id name must be at most 1000 characters"),
})

export type TransferOrderFormType = z.infer<typeof transferOrderSchema>
