export const getPriorityByValue = (priority: "low" | "normal" | "hight") => {
  switch (priority) {
    case "hight":
      return "Hight";
    case "normal":
      return "Normal";
    case "low":
      return "Low";
  }
};
export const getValueByPriority = (priority: "Normal" | "Low" | "Hight") => {
  switch (priority) {
    case "Hight":
      return "hight";
    case "Normal":
      return "normal";
    case "Low":
      return "low";
  }
};
