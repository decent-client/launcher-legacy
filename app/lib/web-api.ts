import { getBase64FromURL, isUUID } from "./utils";

type MojangAPIResponse = {
	name: string;
	id: string;
};

type MojangSessionServerResponse = {
	id: string;
	name: string;
	properties: [
		{
			name: "textures";
			value: string;
			signature?: string;
		},
	];
	profileActions: [];
};

type TexturesBase64String = {
	textures: {
		SKIN: {
			url: string;
			metadata?: {
				model: string;
			};
		};
		CAPE?: {
			url: string;
		};
	};
};

type UUID = string;

export async function getMojangPlayer(player: string) {
	try {
		const mojang: MojangSessionServerResponse = await fetch(
			`https://sessionserver.mojang.com/session/minecraft/profile/${
				isUUID(player) ? player : await getUUID(player)
			}`,
			{
				mode: "no-cors",
			},
		).then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch player from Mojang API");
			}

			return response.json();
		});

		const { textures }: TexturesBase64String = JSON.parse(
			Buffer.from(mojang.properties[0].value, "base64").toString(),
		);

		return {
			successful: true,
			username: mojang.name,
			uuid: mojang.id,
			assets: {
				skin: {
					url: textures?.SKIN?.url,
					base64: await getBase64FromURL(textures.SKIN.url),
					slim: textures.SKIN?.metadata?.model === "slim",
				},
				...(!!textures.CAPE && {
					cape: {
						url: textures.CAPE.url,
						base64: await getBase64FromURL(textures.CAPE.url),
					},
				}),
				...((await fetch(`http://s.optifine.net/capes/${mojang.name}.png`).then(
					({ ok }) => ok,
				)) && {
					optifine: {
						url: `http://s.optifine.net/capes/${mojang.name}.png`,
						base64: await getBase64FromURL(
							`http://s.optifine.net/capes/${mojang.name}.png`,
						),
					},
				}),
			},
		};
	} catch (error) {
		return {
			successful: false,
			error:
				error instanceof Error
					? error.message
					: "There was an error fetching the player",
		};
	}
}

export async function getUUID(username: string) {
	const response: MojangAPIResponse = await fetch(
		`https://api.mojang.com/users/profiles/minecraft/${username}`,
		{
			mode: "no-cors",
		},
	).then((response) => {
		if (!response.ok) {
			throw new Error("Failed to fetch UUID from Mojang API");
		}

		return response.json();
	});

	return response.id as UUID;
}
