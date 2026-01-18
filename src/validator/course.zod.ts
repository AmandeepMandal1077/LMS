import z from "zod";
import { CourseLevel } from "../models/course.model.js";

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .max(50, { error: "Title can be at most 50 characters long" })
    .trim(),
  subtitle: z
    .string()
    .min(1, { error: "Subtitle is required" })
    .max(100, { error: "Subtitle can be at most 100 characters long" })
    .trim(),
  description: z
    .string()
    .min(1, { error: "Description is required" })
    .max(200, { error: "Description can be at most 200 characters long" })
    .trim(),
  category: z.string().min(1, { error: "Category is required" }).trim(),
  level: z
    .enum(CourseLevel, { error: "Invalid course level" })
    .optional()
    .default(CourseLevel.BEGINNER),
  price: z.number().min(0, { error: "Price must be non-negative" }).default(0),
  thumbnail: z.string().min(1, { error: "Thumbnail is required" }),
  enrolledStudents: z
    .array(
      z.object({
        student: z.string(),
        rating: z.number().min(1).max(5).optional(),
      }),
    )
    .optional(),
  lectures: z
    .array(
      z.object({
        lecture: z.string(),
      }),
    )
    .optional(),
  instructor: z.string().min(1, { error: "Course instructor is required" }),
  isPublished: z.boolean().default(false),
  totalLectures: z.number().default(0),
  totalDuration: z.number().default(0),
});

export { courseSchema as courseValidator };
