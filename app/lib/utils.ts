import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBase64FromURL(url: string) {
	const binary = await fetch(url).then((response) => response.arrayBuffer());
	return Buffer.from(binary as never, "binary").toString("base64");
}

export function isUUID(uuid: string) {
	return /^[0-9a-f]{32}$/i.test(uuid.replace(/-/g, ""));
}

export function trimUUID(uuid: string) {
	return uuid.replaceAll(/-/g, "");
}

export function hyphenateUUID(uuid: string) {
	const trimmedUUID = uuid.replaceAll(/-/g, "");

	return `${trimmedUUID.slice(0, 8)}-${trimmedUUID.slice(
		8,
		12,
	)}-${trimmedUUID.slice(12, 16)}-${trimmedUUID.slice(
		16,
		20,
	)}-${trimmedUUID.slice(20, 32)}`;
}
