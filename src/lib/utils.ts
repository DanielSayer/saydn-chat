import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstName(name: string | undefined) {
  if (!name) {
    return "";
  }
  const names = name.split(" ");
  return names[0];
}
