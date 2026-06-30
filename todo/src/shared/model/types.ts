import type { ZodType } from "zod";
import type { components, paths } from "../api/openapi";

export type Task = components["schemas"]["TaskResponse"];

export type PostTask = components["schemas"]["TaskCreate"];

export type ToZodSchema<T extends object> = {
  [K in keyof T]: ZodType<T[K]>;
};

export type BodyRequestType<
  Method extends keyof paths[Path],
  Path extends keyof paths,
  Format extends
    | "application/json"
    | "application/x-www-form-urlencoded"
    | "multipart/form-data" = "application/json",
> = paths[Path][Method] extends {
  requestBody?: {
    content: {
      [x in Format]: infer Body;
    };
  };
}
  ? Body
  : never;
