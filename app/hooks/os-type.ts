import { type OsType, type } from "@tauri-apps/plugin-os";

export function useOsType() {
	try {
		return type() as Exclude<OsType, "ios" | "android">;
	} catch (error) {
		return "unknown";
	}
}
