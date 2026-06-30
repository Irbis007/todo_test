import z from "zod";
import type { PostTask, ToZodSchema } from "./types";

export const createTaskSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().max(300).optional(),
  status: z.enum(["new", "in_progress", "done"]),
  priority: z.enum(["low", "normal", "hight"]),
} satisfies ToZodSchema<PostTask>);
