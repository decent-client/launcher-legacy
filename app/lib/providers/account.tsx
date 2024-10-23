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
import type { MinecraftAccount } from "~/lib/types/auth";

type SelectedAccountState = {
	accounts: MinecraftAccount[];
	setAccounts: (value: MinecraftAccount[]) => void;
	selectedAccount: MinecraftAccount | undefined;
	setSelectedAccount: (value: MinecraftAccount) => void;
	addAccount: (value: MinecraftAccount) => void;
	removeAccount: (value: MinecraftAccount) => void;
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
	const [accounts, setAccounts] = useState<MinecraftAccount[]>([]);
	const selectedAccount = accounts.find((account) => account.active);

	useEffect(() => {
		async function initAccounts() {
			const results = await getAccountsFile(accountsFile);

			if (results) {
				setAccounts(results);
			}
		}

		initAccounts();
	}, []);

	useEffect(() => {
		async function writeAccountsFile(content: MinecraftAccount[]) {
			await writeTextFile(accountsFile, JSON.stringify(content, null, 2), {
				baseDir: BaseDirectory.AppData,
			});
		}

		if (accounts.length > 0) {
			writeAccountsFile(accounts);
		}

		if (!selectedAccount && accounts.length > 0) {
			setSelectedAccount(accounts[0]);
		}
	}, [accounts]);

	async function setSelectedAccount(value: MinecraftAccount) {
		setAccounts(selectAccount(value));
	}

	async function addAccount(value: MinecraftAccount) {
		const filteredAccounts = [...accounts, value].filter(
			(value, index, self) =>
				index === self.findIndex((t) => t.uuid === value.uuid),
		);

		if (accounts.find((account) => account.uuid === value.uuid)) {
			setSelectedAccount(value);
			return toast.warning(`The account "${value.username}" already exists`);
		}

		try {
			setAccounts(filteredAccounts);
		} finally {
			toast.success("Authentication Successful");
		}
	}

	async function removeAccount(account: MinecraftAccount) {
		const filteredAccounts = [...accounts].filter((v) => v !== account);

		console.log(filteredAccounts);

		try {
			setAccounts(filteredAccounts);
		} finally {
			toast.success(`Successfully removed the account "${account.username}"`);
		}
	}

	function selectAccount(toSelect: MinecraftAccount) {
		return accounts.map((account) => ({
			...account,
			active: account.uuid === toSelect.uuid,
		}));
	}

	return (
		<AccountProviderContext.Provider
			value={{
				accounts,
				setAccounts,
				selectedAccount,
				setSelectedAccount,
				addAccount,
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
		) as MinecraftAccount[];
	}

	try {
		// if (!(await exists(accountsFile, { baseDir: BaseDirectory.AppData }))) {
		// 	await mkdir(await appDataDir());
		// }

		await writeTextFile(fileName, JSON.stringify([]), {
			baseDir: BaseDirectory.AppData,
		});
	} catch (error) {
		console.error("Error creating settings file: ", error);
	}
}
