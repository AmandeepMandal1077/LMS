import z from "zod";

export const lectureSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(50, { error: "Title length can be at most 50 characters long" })
    .trim(),
  description: z
    .string()
    .min(1, { error: "Description is required" })
    .max(100, {
      error: "Description length can be at most 100 characters long",
    })
    .trim(),
  videoUrl: z.string().min(1, { error: "Video is required" }),
  duration: z.number().default(0),
  isPreview: z.boolean().default(true),
  publicId: z
    .string()
    .min(1, { error: "Public id is required for management" }),
  order: z.number({ error: "Order is required" }),
});

export { lectureSchema as lectureValidator };
