export const getPriorityColor = (
  priority: "Low" | "Medium" | "Hight",
  op?: number,
) => {
  switch (priority) {
    case "Low":
      return `#2ac619${op ? op : ""}`;
    case "Medium":
      return `#ffb700${op ? op : ""}`;
    case "Hight":
      return `#ff3700${op ? op : ""}`;
  }
};
