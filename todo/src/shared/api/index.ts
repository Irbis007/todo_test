import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { BodyRequestType, Task } from "../model/types";
import { useQueryClient } from "@tanstack/react-query";
import type { paths } from "./openapi";

const fetchClient = createFetchClient<paths>({
  baseUrl: "http://127.0.0.1:8000",
  credentials: "include",
});

const $api = createClient(fetchClient);

export const useGetTasks = (queryParams?: object) => {
  return $api.useQuery("get", "/tasks", {
    params: {
      query: queryParams,
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = $api.useMutation("post", `/tasks`, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["get", "/tasks"] });
    },
  });

  return {
    ...mutation,
    mutateAsync: (data: BodyRequestType<"post", "/tasks">) =>
      mutation.mutateAsync({
        body: data,
      }),
  };
};
export const useUpdateTask = (id: number) => {
  const mutation = $api.useMutation("patch", `/tasks/${id}`);

  return {
    ...mutation,
    mutateAsync: (data: Partial<Task>) =>
      mutation.mutateAsync({
        body: data,
        params: {
          path: {
            task_id: id,
          },
        },
      }),
  };
};
export const useDeleteTask = (id: number, isAdmin: boolean) => {
  const queryClient = useQueryClient();
  const mutation = $api.useMutation("delete", `/tasks/${id}`, {
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["get", "/tasks"] });
    },
  });

  return {
    ...mutation,
    mutateAsync: () =>
      mutation.mutateAsync({
        params: {
          query: {
            is_admin: isAdmin,
          },
          path: {
            task_id: id,
          },
        },
      }),
  };
};
