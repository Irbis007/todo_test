import { type ReactNode, useRef, useState } from "react";
import { useClickOutside } from "../libs";

type Props<T> = {
  title?: string;
  disabled?: boolean;
  selectedValue: T;
} & (
  | {
      canUnselect: boolean;
      onChange: (val: T | undefined) => void;
      options: {
        label: ReactNode | undefined;
        value: T;
      }[];
    }
  | {
      canUnselect?: undefined;

      onChange: (val: T) => void;
      options: {
        label: ReactNode;
        value: T;
      }[];
    }
);

export function Dropdown<T>({
  title,
  options,
  disabled,
  canUnselect,
  onChange,
  selectedValue,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setIsOpen(false));
  return (
    <div className="relative w-max" ref={containerRef}>
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 pr-2 border border-black border-default 
          rounded-sm min-w-35 text-nowrap ${!title ? "text-zinc-400" : "text-black"} ${!disabled && "cursor-pointer"}`}
      >
        <div className="grow">{!title ? "Select" : title}</div>
        {!disabled && (
          <div
            className={`transition-transform duration-300 text-black ${isOpen ? "-rotate-90" : "rotate-90"}`}
          >
            {">"}
          </div>
        )}
        {!!canUnselect && title && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            className="flex items-center justify-center shrink-0 text-sm hover:bg-zinc-200 rounded-full w-5 transition-colors duration-300"
          >
            &#x2715;
          </div>
        )}
      </div>
      <div
        className={`absolute bg-white top-12 grid w-full transition-all z-100 
          ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div
          className={`min-h-0 overflow-hidden rounded-sm ${isOpen && "py-1 border border-default"}`}
        >
          {options.map((item, i) => (
            <div
              onClick={() => {
                setIsOpen(false);
                onChange(item.value);
              }}
              className={`py-2 px-4 cursor-pointer hover:bg-zinc-100 ${selectedValue === item.value ? "bg-zinc-200" : "bg-white"}
               ${i > 0 && "border-t border-default"}`}
              key={i}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
