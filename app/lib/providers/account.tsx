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
import { createContext, useContext, useEffect, useState } from "react";
import { useAsyncEffect } from "~/hooks/async-effect";
import { useMounted } from "~/hooks/mounted";

type Account = {
	username: string;
	active?: boolean;
};

type SelectedAccountState = {
	accounts: Account[];
	setAccounts: (value: Account[]) => void;
	selectedAccount: Account | undefined;
	setSelectedAccount: (value: Account) => void;
	isMounted: boolean;
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
	const isMounted = useMounted();

	let selectedAccount = accounts.find(({ active }) => active);

	useAsyncEffect(async () => {
		await readAccountsFile();

		const unwatch = await watch(
			accountsFile,
			(event) => {
				console.log(event);
			},
			{
				baseDir: BaseDirectory.AppLog,
				delayMs: 500,
			},
		);

		return () => unwatch();
	}, []);

	useEffect(() => {
		const activeAccount = accounts.find(({ active }) => active);

		if (activeAccount) {
			setSelectedAccount({ username: activeAccount.username });
		}
	}, [accounts]);

	async function readAccountsFile() {
		if (await exists(accountsFile, { baseDir: BaseDirectory.AppData })) {
			readTextFile(accountsFile, {
				baseDir: BaseDirectory.AppData,
			}).then((content) => {
				setAccounts((JSON.parse(content) as FileStructure).accounts);
			});
		} else {
			try {
				// if (!(await exists(accountsFile, { baseDir: BaseDirectory.AppData }))) {
				// 	await mkdir(await appDataDir());
				// }

				await writeTextFile(
					accountsFile,
					JSON.stringify({ accounts: [] } as FileStructure),
					{
						baseDir: BaseDirectory.AppData,
					},
				);
			} catch (error) {
				console.error("Error creating settings file: ", error);
			}
		}
	}

	function setSelectedAccount(value: Account) {
		selectedAccount = value;

		if (accounts) {
			setAccounts(
				accounts.map((account) => ({
					...account,
					active: value.username === account.username,
				})),
			);
		}
	}

	return (
		<AccountProviderContext.Provider
			value={{
				accounts,
				setAccounts,
				selectedAccount,
				setSelectedAccount,
				isMounted,
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
