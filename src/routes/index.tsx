import { createFileRoute } from "@tanstack/react-router";

import { PnlCalendar } from "#/components/calendar/pnl-calendar.tsx";
import { JumpToCalendarButton } from "#/components/jump-to-calendar-button.tsx";
import { UniverseWatchlist } from "#/components/watchlist/universe-watchlist.tsx";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="p-4 sm:p-6">
			<PnlCalendar />
			<UniverseWatchlist />
			<JumpToCalendarButton />
		</div>
	);
}
