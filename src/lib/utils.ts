import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Spring Page response or plain array */
export function unwrapPage<T>(data: T[] | { content: T[] }): T[] {
  if (Array.isArray(data)) return data;
  return data.content ?? [];
}
