export const getStatusByValue = (priority: "new" | "in_progress" | "done") => {
  switch (priority) {
    case "new":
      return "New";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
  }
};
export const getValueByStatus = (priority: "New" | "In progress" | "Done") => {
  switch (priority) {
    case "New":
      return "new";
    case "In progress":
      return "in_progress";
    case "Done":
      return "done";
  }
};
