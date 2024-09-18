import { useCallback, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T | undefined>(() => {
		try {
			if (typeof window !== "undefined") {
				const item = window.localStorage.getItem(key);
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
					window.localStorage.setItem(key, JSON.stringify(value));
					setStoredValue(value);
				}
			} catch (error) {
				console.log(error);
			}
		},
		[key],
	);

	const removeStoredValue = () => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(key);
			setStoredValue(undefined);
		}
	};

	return [storedValue as T, setValue, removeStoredValue] as const;
};
