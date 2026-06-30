import { useState } from "react";
import { CreateTask } from "./widgets";
import { useGetTasks } from "./shared/api";
import type { Task } from "./shared/model/types";
import { Dropdown } from "./shared/ui";
import { getPriorityByValue, getStatusByValue } from "./utils";
import { TaskRow } from "./widgets";
import { Button } from "./shared/ui";

type Sorting = {
  order?: "asc" | "desc";
  sort_by?: "priority" | "created_at";
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState<Task["priority"]>();
  const [statusFilter, setStatusFilter] = useState<Task["status"]>();
  const [searchFilter, setSearchFilter] = useState<string>();
  const [sorting, setSorting] = useState<Sorting>({});

  const [page, setPage] = useState(1);
  const limit = 3;

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const { data: tasks, isLoading } = useGetTasks({
    priority: priorityFilter,
    status: statusFilter,
    search: searchFilter,
    limit,
    page,
    ...sorting,
  });

  return (
    <>
      <CreateTask isOpen={isCreateTaskOpen} setIsOpen={setIsCreateTaskOpen} />
      <div className="w-full p-4 bg-zinc-500 flex items-center gap-3">
        <div className="ml-auto text-white">
          {!isAdmin ? "You are a MEMBER" : "You are a ADMIN"}
        </div>
        <button
          onClick={() => setIsAdmin((prev) => !prev)}
          className="px-4 py-2 border border-white text-white cursor-pointer hover:bg-zinc-400 duration-300"
        >
          {!isAdmin ? "Become a Member" : "Become a Admin"}
        </button>
      </div>
      <div className="">
        <div className="max-w-200 mx-auto">
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              className="border mr-auto w-full h-10 px-2 rounded-sm disabled:opacity-50"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search task by title..."
            />
            <Dropdown
              title={getPriorityByValue(priorityFilter)}
              canUnselect
              selectedValue={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                {
                  label: "Low",
                  value: "low",
                },
                {
                  label: "Normal",
                  value: "normal",
                },
                {
                  label: "Hight",
                  value: "hight",
                },
              ]}
            />
            <Dropdown
              title={getStatusByValue(statusFilter)}
              canUnselect
              onChange={setStatusFilter}
              selectedValue={statusFilter}
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
            <div
              onClick={() => setIsCreateTaskOpen(true)}
              className="ml-auto hover:bg-zinc-200 border rounded-sm px-6 py-2 cursor-pointer transition-colors duration-300 
              w-max text-nowrap"
            >
              Create new task
            </div>
          </div>
          <div className="w-full p- flex items-center gap-3 mt-5">
            <div className="flex gap-2 items-center">
              <div className="">sort by:</div>
              <div
                onClick={() => {
                  if (!sorting.sort_by || sorting.sort_by === "priority") {
                    setSorting({
                      sort_by: "created_at",
                      order: "asc",
                    });
                  } else {
                    if (sorting.order === "asc") {
                      setSorting({
                        sort_by: "created_at",
                        order: "desc",
                      });
                    } else if (sorting.order === "desc") {
                      setSorting({
                        sort_by: "created_at",
                        order: undefined,
                      });
                    } else {
                      setSorting({
                        sort_by: "created_at",
                        order: "asc",
                      });
                    }
                  }
                }}
                className="px-4 py-2 border cursor-pointer hover:bg-black/10 duration-300 select-none"
              >
                <span className="mr-2">date created</span>
                <span
                  className={`${sorting.sort_by === "created_at" && sorting.order === "asc" ? "text-zinc-300" : "text-black"}`}
                >
                  &uarr;
                </span>
                <span
                  className={`${sorting.sort_by === "created_at" && sorting.order === "desc" ? "text-zinc-300" : "text-black"}`}
                >
                  &darr;
                </span>
              </div>
              <div
                onClick={() => {
                  if (!sorting.sort_by || sorting.sort_by === "created_at") {
                    setSorting({
                      sort_by: "priority",
                      order: "asc",
                    });
                  } else {
                    if (sorting.order === "asc") {
                      setSorting({
                        sort_by: "priority",
                        order: "desc",
                      });
                    } else if (sorting.order === "desc") {
                      setSorting({
                        sort_by: "priority",
                        order: undefined,
                      });
                    } else {
                      setSorting({
                        sort_by: "priority",
                        order: "asc",
                      });
                    }
                  }
                }}
                className="px-4 py-2 border cursor-pointer hover:bg-black/10 duration-300 select-none"
              >
                <span className="mr-2">Priority</span>
                <span
                  className={`${sorting.sort_by === "priority" && sorting.order === "asc" ? "text-zinc-300" : "text-black"}`}
                >
                  &uarr;
                </span>
                <span
                  className={`${sorting.sort_by === "priority" && sorting.order === "desc" ? "text-zinc-300" : "text-black"}`}
                >
                  &darr;
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-6">
            {!isLoading ? (
              tasks.items.map((item) => (
                <TaskRow key={item.id} task={item} isAdmin={isAdmin} />
              ))
            ) : (
              <div className="flex justify-center">Loading...</div>
            )}
          </div>
          <div className="flex gap-2 justify-center items-center w-full mt-5">
            <Button
              title="Prev"
              isDisabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              type="outlined"
            />

            <span>
              Page {tasks?.page} / {Math.ceil((tasks?.total ?? 0) / limit)}
            </span>

            <Button
              title="Next"
              isDisabled={page >= Math.ceil((tasks?.total ?? 0) / limit)}
              onClick={() => setPage((p) => p + 1)}
              type="outlined"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
