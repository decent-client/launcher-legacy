import type { DeepCamelKeys } from "string-ts";

export type AuthenticationResponse = {
	access_token: string;
	uuid: string;
	expires_in: number;
	xts_token?: string;
};

export type MinecraftProfileResponse = {
	id: string;
	name: string;
};

export type MinecraftAccount = {
	uuid: string;
	username: string;
	authentication: DeepCamelKeys<AuthenticationResponse>;
	active?: boolean;
};
