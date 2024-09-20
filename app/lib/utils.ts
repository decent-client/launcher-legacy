import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deepMerge<T>(...objects: Partial<T>[]) {
	const isObject = (obj: unknown): obj is Record<string, unknown> =>
		obj !== null && typeof obj === "object";

	return objects.reduce((prev: Partial<T>, obj: Partial<T>) => {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const pVal = prev[key];
				const oVal = obj[key];

				if (Array.isArray(pVal) && Array.isArray(oVal)) {
					prev[key] = [...pVal, ...oVal] as T[keyof T];
				} else if (isObject(pVal) && isObject(oVal)) {
					prev[key] = deepMerge(
						pVal as Partial<T>,
						oVal as Partial<T>,
					) as T[keyof T];
				} else {
					prev[key] = oVal as T[keyof T];
				}
			}
		}

		return prev;
	}, {});
}
