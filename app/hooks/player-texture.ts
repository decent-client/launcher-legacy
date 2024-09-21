import { useEffect, useState } from "react";
import fullFallback from "~/../public/images/fallback/full.png";
import faceFallback from "~/../public/images/fallback/head.png";
import { getPlayerFaceTexture, getPlayerTexture } from "~/lib/tauri";

// TODO: Implement texture caching

export function usePlayerTexture(username: string) {
	const [texture, setTexture] = useState<{
		headTexture: string;
		fullTexture: string;
		loading: boolean;
	}>({ headTexture: faceFallback, fullTexture: fullFallback, loading: true });

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		async function fetchTexture() {
			try {
				setTexture({
					headTexture: await getPlayerFaceTexture(username),
					fullTexture: await getPlayerTexture(username),
					loading: false,
				});
			} catch (error) {
				setTexture({
					...texture,
					loading: false,
				});
				console.error("Failed to get player face:", error);
			}
		}

		fetchTexture();
	}, []);

	return texture;
}
