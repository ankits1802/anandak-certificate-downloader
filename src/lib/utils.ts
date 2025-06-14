
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string | null | undefined): string {
  if (!str || typeof str !== 'string') { // Handles null, undefined, empty string, or non-string types
    return 'N/A'; // Default value for invalid input
  }
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
