import { useMatches } from "@remix-run/react";

export function useHandle<T>(): T {
	return useMatches()
		.filter(({ handle }) => handle)
		.find(({ handle }) => handle)?.handle as T;
}
