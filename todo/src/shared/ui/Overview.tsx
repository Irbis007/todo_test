import type { ReactNode } from "react";


type Props = {
  children: ReactNode,
  isOpen: boolean,
}
export function Overview({ children, isOpen }: Props) {
  return <div className={`fixed z-50 inset-0 bg-black/20 ${isOpen ? 'block' : 'hidden'}`}>{children}</div>;
}
