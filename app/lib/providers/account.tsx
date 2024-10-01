import { appDataDir } from "@tauri-apps/api/path";
import {
	BaseDirectory,
	exists,
	mkdir,
	readTextFile,
	watch,
	watchImmediate,
	writeTextFile,
} from "@tauri-apps/plugin-fs";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";
import { useAsyncEffect } from "~/hooks/async-effect";
import { useMounted } from "~/hooks/mounted";
import { sleep } from "../utils";

export type Account = {
	username: string;
	active?: boolean;
};

type SelectedAccountState = {
	accounts: Account[];
	setAccounts: (value: Account[]) => void;
	selectedAccount: Account | undefined;
	setSelectedAccount: (value: Account) => void;
};

type FileStructure = {
	accounts: Account[];
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

	// let selectedAccount = accounts.find(({ active }) => active);
	let selectedAccount = { username: "liqw", active: true } as Account;

	const setSelectedAccount = useCallback(
		async (value: Account) => {
			const updatedAccounts = updateAccounts(accounts, value);
			const preservedState = accounts;

			setAccounts(updatedAccounts);

			let caughtError = false;

			try {
				await sleep(1000);
				throw Error("error");
			} catch (error) {
				toast.error("Failed to switch accounts.");

				caughtError = true;
			} finally {
				if (!caughtError) {
					selectedAccount = value;
					setAccounts(updatedAccounts);
				} else {
					setAccounts(preservedState);
				}
			}
		},
		[accounts],
	);

	useEffect(() => {
		async function initAccounts() {
			const content = await getAccountsFile(accountsFile);

			if (typeof content !== "undefined") {
				setAccounts(
					content.map((s) => ({ ...s, active: s.username === "liqw" })),
				);
			}
		}

		initAccounts();
	}, []);

	useEffect(() => {
		if (!selectedAccount && accounts.length > 0) {
			setSelectedAccount(accounts[0]);
		}
	}, [accounts]);

	function updateAccounts(
		accounts: Account[],
		newAccount: Account,
		identifier: keyof Account = "username",
	) {
		return accounts.map((account) => ({
			...account,
			active:
				account[identifier as keyof Account] ===
				newAccount[identifier as keyof Account],
		}));
	}

	return (
		<AccountProviderContext.Provider
			value={{
				accounts,
				setAccounts,
				selectedAccount,
				setSelectedAccount,
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
		return (
			JSON.parse(
				await readTextFile(fileName, {
					baseDir: BaseDirectory.AppData,
				}),
			) as FileStructure
		).accounts;
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
