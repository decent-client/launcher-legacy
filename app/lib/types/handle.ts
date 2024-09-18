export type Handle = {
	Sidebar?: () => JSX.Element;
	titleBarOptions?: {
		hideTitleBar?: boolean;
		breadcrumb?: string[];
		hideBackButton?: boolean;
		hideTitle?: boolean;
		captionButtons?:
			| {
					hideMinimizeButton?: boolean;
					hideMaximizeButton?: boolean;
					hideCloseButton?: boolean;
			  }
			| boolean;
		hideMenuButtons?: boolean;
	};
};
