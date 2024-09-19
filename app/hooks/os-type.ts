import { type OsType, type } from "@tauri-apps/plugin-os";

type OsReturnType = Exclude<OsType, "ios" | "android"> | "unknown";

export function useOsType(): OsReturnType {
	// return "macos";

	try {
		return type() as Exclude<OsReturnType, "unknown">;
	} catch (error) {
		return "unknown";
	}
}
