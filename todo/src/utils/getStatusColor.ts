export const getStatusColor = (
  priority: "New" | "In progress" | "Done",
  op?: number,
) => {
  switch (priority) {
    case "New":
      return `#ff3700${op ? op : ""}`;
    case "In progress":
      return `#ffb700${op ? op : ""}`;
    case "Done":
      return `#2ac619${op ? op : ""}`;
  }
};
