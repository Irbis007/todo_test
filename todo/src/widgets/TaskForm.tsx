import { useForm } from "@tanstack/react-form";
import { getValueByPriority, getValueByStatus } from "../utils";
import { Overview } from "../shared/ui";
import type { PostTask } from "../shared/model/types";
import { createTaskSchema } from "../shared/model/schemas";
import { showFieldErrors } from "../shared/libs/utils";
import { useState } from "react";
import { Button } from "../shared/ui";

type Props = {
  type: "create" | "edit";
  onSubmit: (val: PostTask) => Promise<unknown>;
  defaultData?: PostTask;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isLoading?: boolean;
};
const priorities = ["Low", "Normal", "Hight"] as const;
const statuses = ["New", "In progress", "Done"] as const;

export function TaskForm({
  onSubmit,
  defaultData,
  isOpen,
  setIsOpen,
  isLoading,
}: Props) {
  const defaultValues: PostTask = {
    title: "",
    description: "",
    priority: "normal",
    status: "new",
    ...defaultData,
  };

  const form = useForm({
    defaultValues,
    onSubmit({ value }) {
      onSubmit(value);
    },
    validators: {
      onChange: createTaskSchema,
    },
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Overview isOpen={isOpen}>
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 max-w-150 w-full
       bg-white py-6 px-4 rounded-lg"
      >
        <div className="w-full space-y-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <span className="text-sm">Priority</span>
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <>
                      <input
                        className="border rounded-sm p-1 block w-full"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Task name..."
                      />
                      <span className="text-sm text-red-500">
                        {showFieldErrors(field, isSubmitted)}
                      </span>
                    </>
                  );
                }}
              />
            </div>
            <div className="space-y-1">
              <span className="text-sm">Priority</span>
              <form.Field
                name="description"
                children={(field) => (
                  <textarea
                    className="border rounded-sm resize-none p-1 block w-full h-20"
                    placeholder="Enter your description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm">Priority</span>
            <form.Field
              name="priority"
              children={(field) => (
                <div className="flex gap-2">
                  {priorities.map((item) => {
                    const isSelected =
                      getValueByPriority(item) === field.state.value;
                    return (
                      <div
                        className={`w-full p-1 rounded-sm border cursor-pointer hover:bg-zinc-100 ${isSelected && "bg-zinc-200"}`}
                        onClick={() =>
                          field.handleChange(getValueByPriority(item))
                        }
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </div>
          <div className="space-y-1">
            <span className="text-sm">Status</span>
            <form.Field
              name="status"
              children={(field) => (
                <div className="flex gap-2">
                  {statuses.map((item) => {
                    const isSelected =
                      getValueByStatus(item) === field.state.value;
                    return (
                      <div
                        className={`w-full p-1 rounded-sm border cursor-pointer hover:bg-zinc-100 ${isSelected && "bg-zinc-200"}`}
                        onClick={() =>
                          field.handleChange(getValueByStatus(item))
                        }
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </div>
          <div className="justify-end flex gap-3 mt-2">
            <Button
              title={"Cancel"}
              onClick={() => {
                setIsOpen(false);
              }}
              type="outlined"
            />
            <Button
              title={isLoading ? "Loading" : "Submit"}
              onClick={() => {
                setIsSubmitted(true);
                form.handleSubmit().then(() => form.reset());
              }}
              type="green"
            />
          </div>
        </div>
      </div>
    </Overview>
  );
}
