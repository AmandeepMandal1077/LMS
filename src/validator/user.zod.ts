import z from "zod";
import { Role } from "../models/user.model.js";

const userSchema = z.object({
  name: z
    .string()
    .min(3, { error: "Name must be at least 3 characters long" })
    .max(50, {
      error: "Name must be at most 50 characters long",
    })
    .trim(),
  email: z
    .email({ error: "Invalid email address" })
    .lowercase({ error: "email must be lowercase" })
    .trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .max(20, { error: "Password must be at most 20 characters long" })
    .trim(),
  role: z
    .enum(Role, { error: "Invalid role" })
    .optional()
    .default(Role.STUDENT),
  avatar: z.string().optional(),
  bio: z
    .string()
    .max(200, { error: "Bio must be at most 200 characters long" })
    .optional(),
  enrolledCourses: z.array(z.string()).optional(),
  enrolledAt: z.date().optional(),
  createdCourses: z.array(z.string()).optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordTokenExpiry: z.date().optional(),
  lastActive: z.date().optional(),
});

export { userSchema as userValidator };
