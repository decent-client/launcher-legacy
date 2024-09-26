import { BaseDirectory, watch } from "@tauri-apps/plugin-fs";
import { createContext, useContext, useEffect, useState } from "react";

type Account = {
	username: string;
	active?: boolean;
};

type SelectedAccountState = {
	accounts: Account[];
	setAccounts: (value: Account[]) => void;
	selectedAccount: Account | undefined;
	setSelectedAccount: (value: Account) => void;
};

const AccountProviderContext = createContext<SelectedAccountState | null>(null);

// TODO: just placeholder, remove later
const tempAccounts = [
	{ username: "liqw", active: true },
	{ username: "liqws_wife", active: false },
];

type FileNameJSON = `${string}.json`;

export function SelectedAccountProvider({
	children,
	accountsFile = "launcher-accounts.json",
	...props
}: {
	children: React.ReactNode;
	accountsFile?: FileNameJSON;
}) {
	const [accounts, setAccounts] = useState<Account[]>(tempAccounts);

	let selectedAccount = accounts.find(({ active }) => active);

	useEffect(() => {
		// watchAccountsFile(accountsFile, setAccounts);
	}, []);

	useEffect(() => {
		const activeAccount = accounts.find(({ active }) => active);

		if (activeAccount) {
			setSelectedAccount({ username: activeAccount.username });
		}
	}, [accounts]);

	function setSelectedAccount(value: Account) {
		selectedAccount = value;

		setAccounts(
			accounts.map((account) => ({
				...account,
				active: value.username === account.username,
			})),
		);
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

async function watchAccountsFile(
	fileName: FileNameJSON,
	onChange: (accounts: Account[]) => void,
) {
	await watch(
		fileName,
		(event) => {
			console.log(event);
		},
		{
			baseDir: BaseDirectory.AppLog,
			delayMs: 500,
		},
	);
}
