type Props = {
  title: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  type: "green" | "red" | "outlined";
  onClick: () => void;
};

export function Button({ title, type, isDisabled, onClick }: Props) {
  const className =
    type === "outlined"
      ? "border hover:bg-zinc-200 disabled:hover:bg-white disabled:opacity-50 w-max"
      : type === "green"
        ? "bg-green-500 text-white hover:bg-green-400 disabled:bg-green-400 w-full"
        : "bg-red-500 text-white hover:bg-red-400 disabled:bg-red-400 w-full";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`rounded-sm px-6 py-2 h-max  cursor-pointer transition-colors duration-300 
         disabled:cursor-not-allowed ${className}`}
    >
      {title}
    </button>
  );
}
