import { createFileRoute } from "@tanstack/react-router";

import { PnlCalendar } from "#/components/calendar/pnl-calendar.tsx";
import { JumpToCalendarButton } from "#/components/jump-to-calendar-button.tsx";
import { AccountSidebar } from "#/components/sidebar/account-sidebar.tsx";
import { UniverseWatchlist } from "#/components/watchlist/universe-watchlist.tsx";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col bg-black text-neutral-300 antialiased lg:flex-row">
			<AccountSidebar />
			<main className="min-w-0 flex-1 p-4 sm:p-6">
				<PnlCalendar />
				<UniverseWatchlist />
			</main>
			<JumpToCalendarButton />
		</div>
	);
}
