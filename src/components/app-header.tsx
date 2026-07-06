import { Link } from "@tanstack/react-router";
import { CalendarDays, Newspaper } from "lucide-react";

import { workspaceColorScheme } from "#/constants/color-scheme.ts";

const tabBaseClass =
	"flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors sm:px-4";
const activeTabClass = `${workspaceColorScheme.accentBorder} ${workspaceColorScheme.accentBg} text-white ${workspaceColorScheme.accentShadow}`;
const inactiveTabClass =
	"border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white";

export function AppHeader() {
	return (
		<header className="sticky top-0 z-30 border-neutral-800 border-b bg-black/90 backdrop-blur">
			<div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="min-w-0">
					<p
						className={`text-[10px] uppercase tracking-[0.24em] ${workspaceColorScheme.accentText}`}
					>
						Persistent PnL workspace
					</p>
					<h1 className="mt-1 font-semibold text-white text-xl tracking-tight">
						PnLBook
					</h1>
				</div>

				<nav
					className="grid gap-2 sm:grid-cols-2 lg:min-w-[34rem]"
					aria-label="Primary workspace"
				>
					<Link
						to="/"
						activeOptions={{ exact: true }}
						className={tabBaseClass}
						activeProps={{ className: activeTabClass }}
						inactiveProps={{ className: inactiveTabClass }}
					>
						<CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
						<span className="min-w-0">
							<span className="block font-medium text-sm">Calendar</span>
							<span className="block truncate text-[11px] text-neutral-500">
								Calendar · Primary watchlist · Universe
							</span>
						</span>
					</Link>
					<Link
						to="/market-intelligence"
						activeOptions={{ exact: true }}
						className={tabBaseClass}
						activeProps={{ className: activeTabClass }}
						inactiveProps={{ className: inactiveTabClass }}
					>
						<Newspaper className="h-4 w-4 shrink-0" aria-hidden="true" />
						<span className="min-w-0">
							<span className="block font-medium text-sm">
								Market Intelligence
							</span>
							<span className="block truncate text-[11px] text-neutral-500">
								Daily thesis · Levels · Catalysts
							</span>
						</span>
					</Link>
				</nav>
			</div>
		</header>
	);
}
