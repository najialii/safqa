import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLocalizedField(
  item: any,
  field: string,
  locale: 'ar' | 'en'
): string {
  const localizedValue = item?.[`${field}_${locale}`];
  const fallbackValue = item?.[`${field}_en`];
  return localizedValue || fallbackValue || '';
}
