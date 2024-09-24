import { createContext, useContext, useState } from "react";

type Account = {
	username: string;
};

type SelectedAccountState = {
	accounts: Account[];
	selectedAccount: Account | null;
	setSelectedAccount: (account: Account) => void;
};

const AccountProviderContext = createContext<SelectedAccountState | null>(null);

export function SelectedAccountProvider({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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
