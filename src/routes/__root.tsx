import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { AppHeader } from "#/components/app-header.tsx";
import { AccountSidebar } from "#/components/sidebar/account-sidebar.tsx";
import { TooltipProvider } from "#/components/ui/tooltip.tsx";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "PnLBook",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: WorkspaceRoot,
	shellComponent: RootDocument,
});

function WorkspaceRoot() {
	return (
		<div className="min-h-screen bg-black text-neutral-300 antialiased">
			<AppHeader />
			<div className="flex flex-col lg:flex-row">
				<AccountSidebar />
				<main className="relative min-w-0 flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<TooltipProvider>{children}</TooltipProvider>
				<Scripts />
			</body>
		</html>
	);
}
