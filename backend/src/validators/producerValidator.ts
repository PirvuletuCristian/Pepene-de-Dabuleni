import z from "zod";

export const producerSchema = z.object({
    name: z.string().min(2, "Name is required").max(255, "Name is too long"),
    product: z.string().min(2, "Product is required").max(255, "Product is too long"),
    latitude: z.number().refine((val) => val >= -90 && val <= 90, "Invalid latitude"),
    longitude: z.number().refine((val) => val >= -180 && val <= 180, "Invalid longitude")
});