import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function deepMerge<T>(...objects: T[]): T {
	const isObject = (obj: unknown) => obj && typeof obj === "object";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return objects.reduce((prev: any, obj: any) => {
		Object.keys(obj as object).forEach((key) => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			} else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = deepMerge(pVal, oVal);
			} else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {} as T);
}
