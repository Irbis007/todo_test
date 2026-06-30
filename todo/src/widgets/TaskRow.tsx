import { useState } from "react";
import { useDeleteTask, useUpdateTask } from "../shared/api";
import type { PostTask, Task } from "../shared/model/types";
import { useForm } from "@tanstack/react-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Dropdown } from "../shared/ui";
import { getPriorityByValue, getStatusByValue } from "../utils";
import { Button } from "../shared/ui";

dayjs.extend(utc);
type Props = {
  task: Task;
  isAdmin: boolean;
};

export const TaskRow = ({ task, isAdmin }: Props) => {
  const { mutateAsync, isPending } = useUpdateTask(task.id);
  const { mutateAsync: deleteTask, isPending: isTaskDeleting } = useDeleteTask(
    task.id,
    isAdmin,
  );

  const [isEdit, setIsEdit] = useState(false);
  const isDisabled = task.status === "done";

  const defaultValues: PostTask = {
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
  };

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      mutateAsync(value).then(() => setIsEdit(false));
    },
  });

  return (
    <div className="">
      <span className="text-sm text-zinc-600">
        created at: {dayjs(task.created_at).local().format("DD MM YYYY, hh:mm")}
      </span>
      <div className="flex gap-2">
        <div className="grow">
          <form.Field
            name="title"
            children={(field) => (
              <input
                disabled={!isEdit}
                type="text"
                className="border mr-auto w-full h-10 px-2 rounded-sm disabled:opacity-50"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <form.Field
            name="description"
            children={(field) => (
              <textarea
                disabled={!isEdit}
                className="border mr-auto w-full h-20 px-2 mt-2 rounded-sm disabled:opacity-50 resize-none"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
        </div>
        <form.Field
          name="priority"
          children={(field) => (
            <Dropdown
              title={getPriorityByValue(field.state.value)}
              disabled={!isEdit}
              selectedValue={field.state.value}
              onChange={field.handleChange}
              options={[
                {
                  label: "Low",
                  value: "low",
                },
                {
                  label: "Medium",
                  value: "normal",
                },
                {
                  label: "Hight",
                  value: "hight",
                },
              ]}
            />
          )}
        />
        <form.Field
          name="status"
          children={(field) => (
            <Dropdown
              title={getStatusByValue(field.state.value)}
              disabled={!isEdit}
              selectedValue={field.state.value}
              onChange={field.handleChange}
              options={[
                {
                  label: "New",
                  value: "new",
                },
                {
                  label: "In progress",
                  value: "in_progress",
                },
                {
                  label: "Done",
                  value: "done",
                },
              ]}
            />
          )}
        />
        {isEdit && (
          <div className="space-y-2 w-25">
            <Button
              title={isPending ? "Loading" : "Save"}
              type="green"
              onClick={() => form.handleSubmit()}
              isDisabled={isDisabled}
            />
            <Button
              title={isTaskDeleting ? "Loading" : "Delete"}
              type="red"
              onClick={() => deleteTask()}
              isDisabled={!isAdmin}
            />
          </div>
        )}
        <Button
          title={!isEdit ? "Edit" : "Cancel"}
          type="outlined"
          onClick={() => {
            if (!isDisabled) setIsEdit((prev) => !prev);
          }}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};
