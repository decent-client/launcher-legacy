import {
	BaseDirectory,
	exists,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import { deepmerge } from "deepmerge-ts";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import type {
	AuthenticationResponse,
	MinecraftResponse,
} from "~/lib/types/auth";
import { getPlayerFaceTexture } from "../tauri";

export type Account = AuthenticationResponse;

type SelectedAccountState = {
	accounts: Account[];
	setAccounts: (value: Account[]) => void;
	appendAccount: (value: Account) => void;
	selectedAccount: Account | undefined;
	setSelectedAccount: (value: Account) => void;
	removeAccount: (uuid: string, account?: Account) => void;
};

type FileStructure = {
	accounts: Account[] | [];
};

const AccountProviderContext = createContext<SelectedAccountState | null>(null);

type FileNameJSON = `${string}.json`;

export function SelectedAccountProvider({
	children,
	accountsFile = "microsoft-accounts.json",
	...props
}: {
	children: React.ReactNode;
	accountsFile?: FileNameJSON;
}) {
	const [accounts, setAccounts] = useState<Account[] | []>([]);

	let selectedAccount = accounts.find((account) => account.state?.active);

	useEffect(() => {
		async function initAccounts() {
			const result = await getAccountsFile(accountsFile);

			if (result) {
				setAccounts(result.accounts);
			}
		}

		initAccounts();
	}, []);

	useEffect(() => {
		async function writeAccountsFile() {
			await writeTextFile(
				accountsFile,
				JSON.stringify({ accounts } as FileStructure, null, 2),
				{
					baseDir: BaseDirectory.AppData,
				},
			);
		}

		console.log(accounts);

		if (accounts.length > 0) {
			writeAccountsFile();
		}

		if (!selectedAccount && accounts.length > 0) {
			setSelectedAccount(accounts[0]);
		}
	}, [accounts]);

	async function setSelectedAccount(value: Account) {
		const updatedAccounts = updateAccounts(accounts, value);
		const preservedState = accounts;

		setAccounts(updatedAccounts);

		let caughtError = false;

		try {
			console.log("");
			// TODO: validate switch with refresh token
		} catch (error) {
			toast.error("Failed to switch accounts");

			caughtError = true;
		} finally {
			if (!caughtError) {
				selectedAccount = value;
				setAccounts(updatedAccounts);
			} else {
				setAccounts(preservedState);
			}
		}
	}

	async function appendAccount(value: Account) {
		const filterAccounts = [...accounts, value].filter(
			(value, index, self) =>
				index === self.findIndex((t) => t.profile.id === value.profile.id),
		);

		if (accounts.find((account) => account.profile.id === value.profile.id)) {
			return toast.warning(
				`The account "${value.profile.name}" already exists`,
			);
		}

		setAccounts(filterAccounts);

		toast.success("Authentication Successful");
	}

	async function removeAccount(uuid: string, account?: Account) {
		const filterAccounts = accounts.filter(
			(account) => account.profile.id !== uuid,
		);

		setAccounts(filterAccounts);

		toast.success(
			account
				? `Successfully removed the account "${account.profile.name}"`
				: "Account successfully removed",
		);
	}

	function updateAccounts(
		accounts: Account[],
		newAccount: Account,
		identifier: keyof MinecraftResponse = "id",
	) {
		return accounts.map((account) =>
			deepmerge(account, {
				state: {
					active:
						account.profile[identifier] === newAccount.profile[identifier],
				},
			} as Account),
		);
	}

	return (
		<AccountProviderContext.Provider
			value={{
				accounts,
				setAccounts,
				appendAccount,
				selectedAccount,
				setSelectedAccount,
				removeAccount,
			}}
			{...props}
		>
			{children}
		</AccountProviderContext.Provider>
	);
}

export const useSelectedAccount = () => {
	const context = useContext(AccountProviderContext);

	if (!context)
		throw new Error(
			"useSelectedAccount must be used within a SelectedAccountProvider",
		);

	return context;
};

async function getAccountsFile(fileName: FileNameJSON) {
	if (await exists(fileName, { baseDir: BaseDirectory.AppData })) {
		return JSON.parse(
			await readTextFile(fileName, {
				baseDir: BaseDirectory.AppData,
			}),
		) as FileStructure;
	}

	try {
		// if (!(await exists(accountsFile, { baseDir: BaseDirectory.AppData }))) {
		// 	await mkdir(await appDataDir());
		// }

		await writeTextFile(
			fileName,
			JSON.stringify({ accounts: [] } as FileStructure),
			{
				baseDir: BaseDirectory.AppData,
			},
		);
	} catch (error) {
		console.error("Error creating settings file: ", error);
	}
}
