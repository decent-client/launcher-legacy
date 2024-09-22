import { useEffect, useState } from "react";
import fullFallback from "~/../public/images/fallback/full.png";
import faceFallback from "~/../public/images/fallback/head.png";
import { useSessionStorage } from "~/hooks/storage";
import { getPlayerFaceTexture, getPlayerTexture } from "~/lib/tauri";

type PlayerTextureCache = Record<
	string,
	{ headTexture: string; fullTexture: string }
>;

export function usePlayerTexture(username: string) {
	const [cache, setCache] = useSessionStorage<PlayerTextureCache>(
		"player-texture-cache",
		{},
	);
	const [texture, setTexture] = useState<{
		headTexture: string;
		fullTexture: string;
		loading: boolean;
	}>({ headTexture: faceFallback, fullTexture: fullFallback, loading: true });

	useEffect(() => {
		async function getTexture() {
			if (cache[username]) {
				return setTexture({ ...cache[username], loading: false });
			}

			try {
				const headTexture = await getPlayerFaceTexture(username);
				const fullTexture = await getPlayerTexture(username);

				setCache({
					...cache,
					[username]: { headTexture, fullTexture },
				});

				setTexture({
					headTexture,
					fullTexture,
					loading: false,
				});
			} catch (error) {
				setTexture((prevTexture) => ({
					...prevTexture,
					loading: false,
				}));
			}
		}

		getTexture();
	}, []);

	return texture;
}
