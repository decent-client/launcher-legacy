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

export async function getPlayerFaceTexture(playerName: string) {
	try {
		return (await invoke("get_player_face", { playerName })) as string;
	} catch (error) {
		throw new Error("Failed to get player face");
	}
}

export async function getPlayerTexture(playerName: string) {
	try {
		return (await invoke("get_player_texture", { playerName })) as string;
	} catch (error) {
		throw new Error("Failed to get player texture");
	}
}
