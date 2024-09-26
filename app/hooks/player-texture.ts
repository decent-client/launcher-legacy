import { useEffect, useState } from "react";
import fullFallback from "~/../public/images/fallback/full.png?url";
import faceFallback from "~/../public/images/fallback/head.png?url";
import { useSessionStorage } from "~/hooks/storage";
import { getPlayerFaceTexture, getPlayerTexture } from "~/lib/tauri";

type PlayerTextureCache = Record<
	string,
	{ headTexture: string; fullTexture: string }
>;

const fallbackTexture = {
	head: "/images/fallback/head.png",
	full: "/images/fallback/full.png",
};

export function usePlayerTexture(username?: string) {
	const [cache, setCache] = useSessionStorage<PlayerTextureCache>(
		"player-texture-cache",
		{},
	);
	const [texture, setTexture] = useState<{
		headTexture: string;
		fullTexture: string;
		loading: boolean;
	}>({
		headTexture: fallbackTexture.head,
		fullTexture: fallbackTexture.full,
		loading: true,
	});

	useEffect(() => {
		if (!username) {
			setTexture({
				headTexture: faceFallback,
				fullTexture: fullFallback,
				loading: false,
			});
		} else {
			getPlayerTextures(username);

			async function getPlayerTextures(username: string) {
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
		}
	}, [username]);

	return texture;
}
