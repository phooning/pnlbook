import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { PrimaryWatchlist } from "./primary-watchlist.tsx";
import type { CollapsedGroups } from "./types.ts";
import {
	defaultPrimarySymbols,
	rowsBySymbol,
	totalMemberships,
	uniqueSymbols,
	universeData,
	watchlistSections,
} from "./watchlist-model.ts";
import {
	SearchResultsTable,
	WatchlistGroupTable,
} from "./watchlist-tables.tsx";
import {
	formatAssetClass,
	formatGroupName,
	getSearchText,
} from "./watchlist-utils.ts";

export function UniverseWatchlist() {
	const [collapsedGroups, setCollapsedGroups] = useState<CollapsedGroups>(() =>
		Object.fromEntries(
			watchlistSections.flatMap((section) =>
				section.groups.map((group) => [group.id, true]),
			),
		),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [primarySymbols, setPrimarySymbols] = useState(
		() => defaultPrimarySymbols,
	);
	const primarySymbolSet = useMemo(
		() => new Set(primarySymbols),
		[primarySymbols],
	);
	const primaryRows = useMemo(
		() =>
			primarySymbols.flatMap((symbol) => {
				const row = rowsBySymbol.get(symbol);

				return row ? [row] : [];
			}),
		[primarySymbols],
	);
	const trimmedSearchQuery = searchQuery.trim();
	const searchRows = useMemo(() => {
		if (!trimmedSearchQuery) {
			return [];
		}

		return Array.from(rowsBySymbol.values()).filter((row) =>
			getSearchText(row).includes(trimmedSearchQuery.toLowerCase()),
		);
	}, [trimmedSearchQuery]);

	function toggleGroupCollapsed(groupId: string) {
		setCollapsedGroups((current) => ({
			...current,
			[groupId]: !(current[groupId] ?? true),
		}));
	}

	function jumpToGroup(groupId: string) {
		setCollapsedGroups((current) => {
			if (current[groupId] === false) {
				return current;
			}

			return {
				...current,
				[groupId]: false,
			};
		});

		requestAnimationFrame(() => {
			const target = document.getElementById(getGroupDomId(groupId));
			if (target) {
				scrollToElementWithEase(target);
			}
		});
	}

	function addPrimarySymbol(symbol: string) {
		setPrimarySymbols((current) =>
			current.includes(symbol) ? current : [...current, symbol],
		);
	}

	function removePrimarySymbol(symbol: string) {
		setPrimarySymbols((current) =>
			current.filter((currentSymbol) => currentSymbol !== symbol),
		);
	}

	function togglePrimarySymbol(symbol: string) {
		setPrimarySymbols((current) =>
			current.includes(symbol)
				? current.filter((currentSymbol) => currentSymbol !== symbol)
				: [...current, symbol],
		);
	}

	return (
		<>
			<PrimaryWatchlist
				rows={primaryRows}
				onAddSymbol={addPrimarySymbol}
				onRemoveSymbol={removePrimarySymbol}
			/>

			<section>
				<header className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
					<div>
						<h2 className="text-lg font-semibold text-white">
							Watchlist Universe
						</h2>
						<p className="mt-1 max-w-2xl text-xs text-neutral-500">
							{universeData.meta.philosophy}
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end xl:justify-end">
						<div className="flex min-w-0 items-center gap-2 sm:w-80">
							<Input
								type="search"
								value={searchQuery}
								placeholder="Search symbols or names"
								aria-label="Search watchlist universe"
								className="border-neutral-800 bg-neutral-950 text-neutral-200 placeholder:text-neutral-600"
								onChange={(event) => setSearchQuery(event.target.value)}
							/>
							{searchQuery ? (
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									className="border border-neutral-800 bg-neutral-950 text-neutral-500 hover:bg-neutral-900 hover:text-white"
									aria-label="Clear watchlist search"
									title="Clear search"
									onClick={() => setSearchQuery("")}
								>
									<X />
								</Button>
							) : null}
						</div>
						<div className="grid grid-cols-3 gap-2 text-right text-xs">
							<Metric label="Groups" value={universeData.watchlists.length} />
							<Metric label="Rows" value={totalMemberships} />
							<Metric label="Symbols" value={uniqueSymbols} />
						</div>
					</div>
				</header>

				{trimmedSearchQuery ? (
					<SearchResultsTable
						rows={searchRows}
						searchQuery={trimmedSearchQuery}
						primarySymbolSet={primarySymbolSet}
						onTogglePrimarySymbol={togglePrimarySymbol}
					/>
				) : (
					<div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_16rem]">
						<div className="min-w-0 space-y-6">
							{watchlistSections.map((section) => (
								<section key={section.assetClass} className="space-y-3">
									<div className="flex items-center justify-between border-b border-neutral-800 pb-2">
										<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
											{formatAssetClass(section.assetClass)}
										</h3>
										<span className="text-xs text-neutral-600">
											{section.groups.length} groups / {section.symbolCount}{" "}
											rows
										</span>
									</div>

									<div className="space-y-4">
										{section.groups.map((group) => (
											<WatchlistGroupTable
												key={group.id}
												group={group}
												isCollapsed={collapsedGroups[group.id] ?? true}
												primarySymbolSet={primarySymbolSet}
												onToggleCollapsed={toggleGroupCollapsed}
												onTogglePrimarySymbol={togglePrimarySymbol}
												getGroupDomId={getGroupDomId}
											/>
										))}
									</div>
								</section>
							))}
						</div>

						<WatchlistTableOfContents
							collapsedGroups={collapsedGroups}
							onJumpToGroup={jumpToGroup}
						/>
					</div>
				)}
			</section>
		</>
	);
}

function WatchlistTableOfContents({
	collapsedGroups,
	onJumpToGroup,
}: {
	collapsedGroups: CollapsedGroups;
	onJumpToGroup: (groupId: string) => void;
}) {
	return (
		<nav
			className="sticky top-6 hidden max-h-[calc(100vh-3rem)] overflow-y-auto border-neutral-800 border-l pl-4 2xl:block"
			aria-label="Watchlist tables"
		>
			<div className="mb-3 text-[10px] uppercase tracking-wider text-neutral-500">
				Tables
			</div>
			<div className="space-y-4">
				{watchlistSections.map((section) => (
					<div key={section.assetClass}>
						<div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
							{formatAssetClass(section.assetClass)}
						</div>
						<div className="space-y-1">
							{section.groups.map((group) => (
								<button
									key={group.id}
									type="button"
									className={`block w-full rounded border border-transparent px-2 py-1 text-left text-[11px] leading-snug transition-colors hover:border-neutral-800 hover:bg-neutral-900 hover:text-white ${
										collapsedGroups[group.id]
											? "text-neutral-600"
											: "text-neutral-400"
									}`}
									onClick={() => onJumpToGroup(group.id)}
								>
									{formatGroupName(group.name)}
								</button>
							))}
						</div>
					</div>
				))}
			</div>
		</nav>
	);
}

function Metric({ label, value }: { label: string; value: number }) {
	return (
		<div>
			<div className="font-semibold text-white">{value}</div>
			<div className="uppercase tracking-wider text-neutral-600">{label}</div>
		</div>
	);
}

function scrollToElementWithEase(target: HTMLElement) {
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const headerOffset = 24;
	const startY = window.scrollY;
	const targetY =
		target.getBoundingClientRect().top + window.scrollY - headerOffset;
	const distance = targetY - startY;
	const duration = prefersReducedMotion ? 0 : 520;
	const startTime = window.performance.now();

	if (duration === 0) {
		window.scrollTo({ top: targetY });
		return;
	}

	function easeInOutCubic(progress: number) {
		return progress < 0.5
			? 4 * progress * progress * progress
			: 1 - (-2 * progress + 2) ** 3 / 2;
	}

	function step(currentTime: number) {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);

		window.scrollTo({
			top: startY + distance * easeInOutCubic(progress),
		});

		if (progress < 1) {
			window.requestAnimationFrame(step);
		}
	}

	window.requestAnimationFrame(step);
}

function getGroupDomId(groupId: string) {
	return `watchlist-${groupId}`;
}
