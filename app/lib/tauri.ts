import { invoke } from "@tauri-apps/api/core";
import type { Window as CurrentWindow } from "@tauri-apps/api/window";

export async function setupWindows() {
	await invoke("setup_windows");
}

export async function showSnapOverlay(window: CurrentWindow) {
	window.setFocus().then(() => {
		invoke("show_snap_overlay");
	});
}
