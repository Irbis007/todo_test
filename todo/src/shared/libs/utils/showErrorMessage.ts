import type { FieldApi } from "@tanstack/react-form";

const extractZodErrorMessage = (err: unknown): string => {
  if (Array.isArray(err)) {
    return err.map(extractZodErrorMessage).join("; ");
  }
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    if ("error" in err && typeof err.error === "string") return err.error;
    if ("message" in err && typeof err.message === "string") return err.message;
  }
  return String(err);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFieldApi =
  | FieldApi<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      never
    >
  | FieldApi<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >;

export function showFieldErrors(field: AnyFieldApi, isSubmitted: boolean) {
  const { isValid, isDirty, errors } = field.state.meta;
  const shouldShowError = !isValid && (isDirty || isSubmitted);

  if (!shouldShowError || !errors.length) {
    return undefined;
  }

  // Flatten and join error messages
  const messages = errors
    .map((e) =>
      Array.isArray(e)
        ? e.map(extractZodErrorMessage).join("; ")
        : extractZodErrorMessage(e),
    )
    .join("; ");

  return messages;
}
