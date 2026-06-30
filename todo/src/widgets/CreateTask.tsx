import { useCreateTask } from "../shared/api";
import { TaskForm } from "./TaskForm";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

export function CreateTask(props: Props) {
  const { mutateAsync, isPending } = useCreateTask();
  return (
    <TaskForm
      {...props}
      isLoading={isPending}
      type="create"
      onSubmit={(data) => mutateAsync(data).then(() => props.setIsOpen(false))}
    />
  );
}
