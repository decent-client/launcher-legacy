import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	return createStorageHook(window.localStorage, key, initialValue);
}

export function useSessionStorage<T>(key: string, initialValue: T) {
	return createStorageHook(window.sessionStorage, key, initialValue);
}

function createStorageHook<T>(storage: Storage, key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T | undefined>(() => {
		try {
			if (typeof window !== "undefined") {
				const item = storage.getItem(key);
				return item !== null ? JSON.parse(item) : initialValue;
			}
		} catch (error) {
			console.log(error);
		}
		return initialValue;
	});

	const setValue = useCallback(
		(value: T) => {
			try {
				if (typeof window !== "undefined") {
					storage.setItem(key, JSON.stringify(value));
					setStoredValue(value);
				}
			} catch (error) {
				console.log(error);
			}
		},
		[key, storage],
	);

	const removeStoredValue = () => {
		if (typeof window !== "undefined") {
			storage.removeItem(key);
			setStoredValue(undefined);
		}
	};

	return [storedValue as T, setValue, removeStoredValue] as const;
}
