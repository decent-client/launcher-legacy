import { BaseDirectory, watch } from "@tauri-apps/plugin-fs";
import { createContext, useContext, useEffect, useState } from "react";

type Account = {
	username: string;
	active?: boolean;
};

type SelectedAccountState = {
	accounts: Account[];
	selectedAccount: Account | null;
	setSelectedAccount: (account: Account) => void;
};

const AccountProviderContext = createContext<SelectedAccountState | null>(null);

type FileNameJSON = `${string}.json`;

export function SelectedAccountProvider({
	children,
	accountsFile = "launcher-accounts.json",
	...props
}: {
	children: React.ReactNode;
	accountsFile?: FileNameJSON;
}) {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

	useEffect(() => {
		setAccounts([{ username: "liqw", active: true }]);

		// watchAccountsFile(accountsFile, setAccounts);
	}, []);

	useEffect(() => {
		const activeAccount = accounts.find(({ active }) => active)?.username;

		if (activeAccount) {
			setSelectedAccount({ username: activeAccount });
		}
	}, [accounts]);

	return (
		<AccountProviderContext.Provider
			value={{
				accounts,
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
