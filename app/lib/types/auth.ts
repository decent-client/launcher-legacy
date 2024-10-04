export type AuthenticationData = {
	access_token: string;
	uuid: string;
	expires_in: number;
	xts_token?: string;
};

export type MinecraftResponse = {
	id: string;
	name: string;
};

export type AuthenticationResponse = {
	auth_data: AuthenticationData;
	profile: MinecraftResponse;
	state?: {
		active: boolean;
	};
};
