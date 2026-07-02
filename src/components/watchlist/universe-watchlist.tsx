import { ChevronDown, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import universe from "#/constants/universe.json";

type AssetClass = "equity" | "etf" | "fund" | "index" | "crypto" | "futures";
type SortDirection = "asc" | "desc";
type ColumnId =
	| "symbol"
	| "price"
	| "changePercent"
	| "peRatio"
	| "dayRange"
	| "week52Range"
	| "performance"
	| "averageVolume"
	| "assetClass";

type UniverseWatchlist = {
	id: string;
	name: string;
	source_table: string;
	asset_class: AssetClass;
	namespace: string;
	theme: string;
	symbols: Array<string>;
};

type Universe = {
	generated_at_utc: string;
	meta: {
		philosophy: string;
	};
	watchlists: Array<UniverseWatchlist>;
};

type RangeValue = {
	low: number;
	current: number;
	high: number;
};

type PerformanceValue = {
	d5: number;
	m3: number;
	y1: number;
};

type WatchlistRow = {
	key: string;
	symbol: string;
	assetClass: AssetClass;
	price: number;
	changePercent: number;
	peRatio: number | null;
	dayRange: RangeValue;
	week52Range: RangeValue;
	performance: PerformanceValue;
	averageVolume: RangeValue;
};

type ColumnDefinition = {
	id: ColumnId;
	label: string;
	defaultWidth: number;
	minWidth: number;
	align?: "right";
	sortable?: boolean;
};

type SortState = {
	columnId: ColumnId;
	direction: SortDirection;
};

type CollapsedGroups = Record<string, boolean>;

const assetClassOrder: Array<AssetClass> = [
	"equity",
	"etf",
	"fund",
	"index",
	"crypto",
	"futures",
];

const columns: Array<ColumnDefinition> = [
	{
		id: "symbol",
		label: "Symbol",
		defaultWidth: 124,
		minWidth: 112,
		sortable: true,
	},
	{
		id: "price",
		label: "Price",
		defaultWidth: 84,
		minWidth: 76,
		align: "right",
		sortable: true,
	},
	{
		id: "changePercent",
		label: "Chg%",
		defaultWidth: 76,
		minWidth: 68,
		align: "right",
		sortable: true,
	},
	{
		id: "peRatio",
		label: "P/E",
		defaultWidth: 66,
		minWidth: 58,
		align: "right",
		sortable: true,
	},
	{
		id: "dayRange",
		label: "Day Range",
		defaultWidth: 136,
		minWidth: 120,
		sortable: true,
	},
	{
		id: "week52Range",
		label: "52W Range",
		defaultWidth: 140,
		minWidth: 124,
		sortable: true,
	},
	{
		id: "performance",
		label: "5d / 3m / 1y",
		defaultWidth: 132,
		minWidth: 116,
		sortable: true,
	},
	{
		id: "averageVolume",
		label: "Avg Vol",
		defaultWidth: 118,
		minWidth: 106,
		sortable: true,
	},
	{
		id: "assetClass",
		label: "Asset",
		defaultWidth: 76,
		minWidth: 70,
		sortable: true,
	},
];

const defaultColumnWidths = columns.reduce<Record<ColumnId, number>>(
	(widths, column) => {
		widths[column.id] = column.defaultWidth;
		return widths;
	},
	{} as Record<ColumnId, number>,
);

const universeData = universe as Universe;

type WatchlistGroup = UniverseWatchlist & { rows: Array<WatchlistRow> };

const watchlistSections = assetClassOrder
	.map((assetClass) => {
		const groups = universeData.watchlists
			.filter((group) => group.asset_class === assetClass)
			.map((group) => ({
				...group,
				rows: group.symbols.map((symbol, index) =>
					buildPlaceholderRow(symbol, group, index),
				),
			}));

		return {
			assetClass,
			groups,
			symbolCount: groups.reduce(
				(total, group) => total + group.rows.length,
				0,
			),
		};
	})
	.filter((section) => section.groups.length > 0);

const totalMemberships = universeData.watchlists.reduce(
	(total, group) => total + group.symbols.length,
	0,
);
const uniqueSymbols = new Set(
	universeData.watchlists.flatMap((group) => group.symbols),
).size;
const universeRows = watchlistSections.flatMap((section) =>
	section.groups.flatMap((group) => group.rows),
);
const rowsBySymbol = universeRows.reduce<Map<string, WatchlistRow>>(
	(rows, row) => {
		if (!rows.has(row.symbol)) {
			rows.set(row.symbol, row);
		}

		return rows;
	},
	new Map(),
);
const defaultPrimarySymbols = ["SPY", "QQQ", "AAPL", "MSFT", "NVDA"].filter(
	(symbol) => rowsBySymbol.has(symbol),
);

export function UniverseWatchlist() {
	const [collapsedGroups, setCollapsedGroups] = useState<CollapsedGroups>({});
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

	function toggleGroupCollapsed(groupId: string) {
		setCollapsedGroups((current) => ({
			...current,
			[groupId]: !current[groupId],
		}));
	}

	function jumpToGroup(groupId: string) {
		setCollapsedGroups((current) => ({
			...current,
			[groupId]: false,
		}));

		const target = document.getElementById(getGroupDomId(groupId));
		if (target) {
			scrollToElementWithEase(target);
		}
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
				<header className="mb-4 flex items-end justify-between gap-4">
					<div>
						<h2 className="text-lg font-semibold text-white">
							Watchlist Universe
						</h2>
						<p className="mt-1 max-w-2xl text-xs text-neutral-500">
							{universeData.meta.philosophy}
						</p>
					</div>
					<div className="grid grid-cols-3 gap-2 text-right text-xs">
						<Metric label="Groups" value={universeData.watchlists.length} />
						<Metric label="Rows" value={totalMemberships} />
						<Metric label="Symbols" value={uniqueSymbols} />
					</div>
				</header>

				<div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_16rem]">
					<div className="min-w-0 space-y-6">
						{watchlistSections.map((section) => (
							<section key={section.assetClass} className="space-y-3">
								<div className="flex items-center justify-between border-b border-neutral-800 pb-2">
									<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
										{formatAssetClass(section.assetClass)}
									</h3>
									<span className="text-xs text-neutral-600">
										{section.groups.length} groups / {section.symbolCount} rows
									</span>
								</div>

								<div className="space-y-4">
									{section.groups.map((group) => (
										<WatchlistGroupTable
											key={group.id}
											group={group}
											isCollapsed={collapsedGroups[group.id] ?? false}
											primarySymbolSet={primarySymbolSet}
											onToggleCollapsed={toggleGroupCollapsed}
											onTogglePrimarySymbol={togglePrimarySymbol}
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
			</section>
		</>
	);
}

function PrimaryWatchlist({
	rows,
	onAddSymbol,
	onRemoveSymbol,
}: {
	rows: Array<WatchlistRow>;
	onAddSymbol: (symbol: string) => void;
	onRemoveSymbol: (symbol: string) => void;
}) {
	return (
		<section className="mb-10">
			<header className="mb-4 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-white">
						Primary Watchlist
					</h2>
					<p className="mt-1 text-xs text-neutral-500">
						{rows.length} active symbols
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900 hover:text-white"
					disabled={defaultPrimarySymbols.every((symbol) =>
						rows.some((row) => row.symbol === symbol),
					)}
					onClick={() => {
						for (const symbol of defaultPrimarySymbols) {
							onAddSymbol(symbol);
						}
					}}
				>
					<Plus />
					Reset
				</Button>
			</header>

			{rows.length > 0 ? (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
					{rows.map((row) => (
						<PrimaryWatchlistCard
							key={row.symbol}
							row={row}
							onRemoveSymbol={onRemoveSymbol}
						/>
					))}
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-950/60 px-4 py-8 text-center text-sm text-neutral-500">
					No symbols selected
				</div>
			)}
		</section>
	);
}

function PrimaryWatchlistCard({
	row,
	onRemoveSymbol,
}: {
	row: WatchlistRow;
	onRemoveSymbol: (symbol: string) => void;
}) {
	const isUp = row.changePercent >= 0;

	return (
		<article className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
			<div className="mb-3 flex items-start justify-between gap-3">
				<div>
					<div className="font-semibold text-white text-lg leading-none">
						{row.symbol}
					</div>
					<div className="mt-1 text-[10px] uppercase tracking-wider text-neutral-600">
						{formatAssetClass(row.assetClass)}
					</div>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					className="text-neutral-500 hover:bg-neutral-800 hover:text-white"
					aria-label={`Remove ${row.symbol} from primary watchlist`}
					title={`Remove ${row.symbol}`}
					onClick={() => onRemoveSymbol(row.symbol)}
				>
					<X />
				</Button>
			</div>

			<div className="mb-3 flex items-baseline justify-between gap-3">
				<div className="font-semibold text-neutral-100 text-xl">
					{formatPrice(row.price)}
				</div>
				<div
					className={`font-medium text-sm ${isUp ? "text-green-400" : "text-red-400"}`}
				>
					{isUp ? "+" : ""}
					{row.changePercent.toFixed(2)}%
				</div>
			</div>

			<IntradaySparkline row={row} />

			<div className="mt-3 grid grid-cols-2 gap-2 border-neutral-800 border-t pt-3 text-xs">
				<div>
					<div className="text-[10px] uppercase tracking-wider text-neutral-600">
						Low
					</div>
					<div className="font-medium text-neutral-300">
						{formatPrice(row.dayRange.low)}
					</div>
				</div>
				<div className="text-right">
					<div className="text-[10px] uppercase tracking-wider text-neutral-600">
						High
					</div>
					<div className="font-medium text-neutral-300">
						{formatPrice(row.dayRange.high)}
					</div>
				</div>
			</div>
		</article>
	);
}

function IntradaySparkline({ row }: { row: WatchlistRow }) {
	const isUp = row.changePercent >= 0;
	const strokeColor = isUp ? "#4ade80" : "#f87171";
	const fillColor = isUp
		? "rgba(74, 222, 128, 0.12)"
		: "rgba(248, 113, 113, 0.12)";
	const values = Array.from({ length: 16 }, (_, index) => {
		const wobble = ((hash(`${row.symbol}:spark:${index}`) % 100) - 50) / 100;
		const trend = (row.changePercent / 100) * (index / 15);

		return row.price * (1 + trend + wobble / 100);
	});
	const min = Math.min(...values);
	const max = Math.max(...values);
	const width = 220;
	const height = 72;
	const points = values.map((value, index) => {
		const x = (index / (values.length - 1)) * width;
		const y =
			height - ((value - min) / Math.max(0.01, max - min)) * (height - 12) - 6;

		return { x, y };
	});
	const linePath = points
		.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
		.join(" ");
	const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

	return (
		<div className="h-20 rounded-md border border-neutral-800 bg-neutral-950/70 p-2">
			<svg
				className="h-full w-full"
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={`${row.symbol} one day price graph`}
				preserveAspectRatio="none"
			>
				<path d={areaPath} fill={fillColor} />
				<path
					d={linePath}
					fill="none"
					stroke={strokeColor}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2.5"
				/>
			</svg>
		</div>
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

function WatchlistGroupTable({
	group,
	isCollapsed,
	primarySymbolSet,
	onToggleCollapsed,
	onTogglePrimarySymbol,
}: {
	group: WatchlistGroup;
	isCollapsed: boolean;
	primarySymbolSet: Set<string>;
	onToggleCollapsed: (groupId: string) => void;
	onTogglePrimarySymbol: (symbol: string) => void;
}) {
	const [sort, setSort] = useState<SortState>({
		columnId: "changePercent",
		direction: "desc",
	});
	const [columnWidths, setColumnWidths] =
		useState<Record<ColumnId, number>>(defaultColumnWidths);

	const sortedRows = useMemo(
		() => sortRows(group.rows, sort),
		[group.rows, sort],
	);
	const tableWidth = columns.reduce(
		(total, column) => total + columnWidths[column.id],
		0,
	);

	function updateSort(columnId: ColumnId) {
		setSort((current) => ({
			columnId,
			direction:
				current.columnId === columnId && current.direction === "desc"
					? "asc"
					: "desc",
		}));
	}

	function resizeColumn(column: ColumnDefinition, delta: number) {
		setColumnWidths((current) => ({
			...current,
			[column.id]: Math.max(column.minWidth, current[column.id] + delta),
		}));
	}

	return (
		<div
			id={getGroupDomId(group.id)}
			className="scroll-mt-6 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50"
		>
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/80 px-4 py-2">
				<button
					type="button"
					className="group flex min-w-0 items-center gap-2 text-left"
					aria-expanded={!isCollapsed}
					aria-controls={`${getGroupDomId(group.id)}-table`}
					onClick={() => onToggleCollapsed(group.id)}
				>
					<ChevronDown
						className={`size-4 shrink-0 text-neutral-500 transition-transform group-hover:text-neutral-300 ${
							isCollapsed ? "-rotate-90" : ""
						}`}
					/>
					<div className="min-w-0">
						<h4 className="truncate text-xs font-semibold uppercase tracking-wider text-neutral-300 group-hover:text-white">
							{formatGroupName(group.name)}
						</h4>
						<div className="mt-0.5 truncate text-[10px] text-neutral-600">
							{group.source_table}
						</div>
					</div>
				</button>
				<span className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-500">
					{group.rows.length} symbols
				</span>
			</div>

			<div
				id={`${getGroupDomId(group.id)}-table`}
				className={`grid transition-[grid-template-rows] duration-200 ease-out ${
					isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
				}`}
			>
				<div className="min-h-0 overflow-hidden">
					<div className="overflow-x-auto">
						<table
							className="w-full border-collapse table-fixed text-left"
							style={{ minWidth: tableWidth }}
						>
							<colgroup>
								{columns.map((column) => (
									<col
										key={column.id}
										style={{
											width: `${(columnWidths[column.id] / tableWidth) * 100}%`,
										}}
									/>
								))}
							</colgroup>
							<thead>
								<tr className="border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-500">
									{columns.map((column) => (
										<ResizableHeaderCell
											key={column.id}
											column={column}
											isSorted={sort.columnId === column.id}
											sortDirection={sort.direction}
											onSort={updateSort}
											onResize={resizeColumn}
										/>
									))}
								</tr>
							</thead>
							<tbody>
								{sortedRows.map((row) => (
									<WatchlistTickerRow
										key={row.key}
										row={row}
										isPrimary={primarySymbolSet.has(row.symbol)}
										onTogglePrimarySymbol={onTogglePrimarySymbol}
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

function ResizableHeaderCell({
	column,
	isSorted,
	sortDirection,
	onSort,
	onResize,
}: {
	column: ColumnDefinition;
	isSorted: boolean;
	sortDirection: SortDirection;
	onSort: (columnId: ColumnId) => void;
	onResize: (column: ColumnDefinition, delta: number) => void;
}) {
	function startResize(event: React.PointerEvent<HTMLDivElement>) {
		event.preventDefault();
		const startX = event.clientX;
		let lastDelta = 0;

		function handlePointerMove(moveEvent: PointerEvent) {
			const delta = moveEvent.clientX - startX;
			onResize(column, delta - lastDelta);
			lastDelta = delta;
		}

		function handlePointerUp() {
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		}

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
	}

	return (
		<th
			className={`relative px-4 py-2 font-medium ${
				column.align === "right" ? "text-right" : ""
			}`}
		>
			<button
				type="button"
				data-watchlist-sort={column.id}
				className={`w-full truncate text-left ${
					column.align === "right" ? "text-right" : ""
				} ${column.sortable ? "cursor-pointer" : "cursor-default"}`}
				onClick={() => {
					if (column.sortable) {
						onSort(column.id);
					}
				}}
			>
				<span>{column.label}</span>
				{isSorted && (
					<span className="ml-1 text-neutral-300">
						{sortDirection === "asc" ? "▲" : "▼"}
					</span>
				)}
			</button>
			<div
				data-watchlist-resize={column.id}
				className="absolute top-1 right-0 h-[calc(100%-0.5rem)] w-2 cursor-col-resize touch-none border-neutral-800 border-r"
				onPointerDown={startResize}
				title="Resize column"
			/>
		</th>
	);
}

function WatchlistTickerRow({
	row,
	isPrimary,
	onTogglePrimarySymbol,
}: {
	row: WatchlistRow;
	isPrimary: boolean;
	onTogglePrimarySymbol: (symbol: string) => void;
}) {
	const isUp = row.changePercent >= 0;

	return (
		<tr className="border-b border-neutral-900/60 text-xs transition-colors last:border-0 hover:bg-neutral-800/20">
			<td className="px-4 py-3">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						className={`border border-neutral-800 ${
							isPrimary
								? "bg-neutral-800 text-neutral-200 hover:bg-red-500/10 hover:text-red-300"
								: "bg-neutral-950 text-neutral-500 hover:bg-green-500/10 hover:text-green-300"
						}`}
						aria-label={
							isPrimary
								? `Remove ${row.symbol} from primary watchlist`
								: `Add ${row.symbol} to primary watchlist`
						}
						title={
							isPrimary
								? `Remove ${row.symbol} from primary watchlist`
								: `Add ${row.symbol} to primary watchlist`
						}
						onClick={() => onTogglePrimarySymbol(row.symbol)}
					>
						{isPrimary ? <X /> : <Plus />}
					</Button>
					<span className="font-semibold text-white">{row.symbol}</span>
				</div>
			</td>
			<td className="px-4 py-3 text-right text-neutral-200">
				{formatPrice(row.price)}
			</td>
			<td
				className={`px-4 py-3 text-right font-medium ${
					isUp ? "text-green-400" : "text-red-400"
				}`}
			>
				{isUp ? "+" : ""}
				{row.changePercent.toFixed(2)}%
			</td>
			<td className="px-4 py-3 text-right text-neutral-400">
				{row.peRatio === null ? "-" : row.peRatio.toFixed(1)}
			</td>
			<td className="px-4 py-3">
				<RangeBar
					range={row.dayRange}
					format={(value) => `$${value.toFixed(1)}`}
				/>
			</td>
			<td className="px-4 py-3">
				<RangeBar
					range={row.week52Range}
					format={(value) => `$${value.toFixed(0)}`}
				/>
			</td>
			<td className="px-4 py-3">
				<PerformanceStrip performance={row.performance} />
			</td>
			<td className="px-4 py-3">
				<VolumeRange range={row.averageVolume} />
			</td>
			<td className="px-4 py-3">
				<span className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-500">
					{row.assetClass}
				</span>
			</td>
		</tr>
	);
}

function RangeBar({
	range,
	format,
}: {
	range: RangeValue;
	format: (value: number) => string;
}) {
	const pct = rangePercent(range);

	return (
		<div className="flex items-center gap-2">
			<span className="w-10 truncate text-right text-[10px] text-neutral-500">
				{format(range.low)}
			</span>
			<div className="relative h-1 flex-1 rounded-full bg-neutral-800">
				<div
					className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-white"
					style={{ left: `calc(${pct}% - 1px)` }}
				/>
			</div>
			<span className="w-10 truncate text-[10px] text-neutral-500">
				{format(range.high)}
			</span>
		</div>
	);
}

function PerformanceStrip({ performance }: { performance: PerformanceValue }) {
	return (
		<div className="flex items-center gap-2 text-[10px]">
			<PerformanceValue value={performance.d5} />
			<span className="text-neutral-700">/</span>
			<PerformanceValue value={performance.m3} />
			<span className="text-neutral-700">/</span>
			<PerformanceValue value={performance.y1} />
		</div>
	);
}

function PerformanceValue({ value }: { value: number }) {
	return (
		<span className={value >= 0 ? "text-green-400" : "text-red-400"}>
			{value > 0 ? "+" : ""}
			{value.toFixed(1)}%
		</span>
	);
}

function VolumeRange({ range }: { range: RangeValue }) {
	const pct = rangePercent(range);

	return (
		<div className="flex flex-col gap-1">
			<div className="text-center font-medium text-[10px] text-blue-400">
				{range.current.toFixed(1)}M
			</div>
			<div className="h-1 overflow-hidden rounded-full bg-neutral-800">
				<div
					className="h-full rounded-full bg-blue-500/60"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<div className="flex justify-between text-[10px] text-neutral-600">
				<span>{range.low.toFixed(0)}M</span>
				<span>{range.high.toFixed(0)}M</span>
			</div>
		</div>
	);
}

function sortRows(rows: Array<WatchlistRow>, sort: SortState) {
	return rows.toSorted((first, second) => {
		const firstValue = getSortValue(first, sort.columnId);
		const secondValue = getSortValue(second, sort.columnId);
		const direction = sort.direction === "asc" ? 1 : -1;

		if (typeof firstValue === "string" && typeof secondValue === "string") {
			return firstValue.localeCompare(secondValue) * direction;
		}

		return (Number(firstValue) - Number(secondValue)) * direction;
	});
}

function getSortValue(row: WatchlistRow, columnId: ColumnId) {
	switch (columnId) {
		case "symbol":
			return row.symbol;
		case "price":
			return row.price;
		case "changePercent":
			return row.changePercent;
		case "peRatio":
			return row.peRatio ?? -1;
		case "dayRange":
			return row.dayRange.current;
		case "week52Range":
			return rangePercent(row.week52Range);
		case "performance":
			return row.performance.y1;
		case "averageVolume":
			return row.averageVolume.current;
		case "assetClass":
			return row.assetClass;
	}
}

function buildPlaceholderRow(
	symbol: string,
	group: UniverseWatchlist,
	index: number,
): WatchlistRow {
	const base = hash(`${group.id}:${symbol}`);
	const priceBase = group.asset_class === "crypto" ? 15_000 : 20;
	const priceRange = group.asset_class === "futures" ? 450 : 520;
	const price = priceBase + (base % priceRange) + index * 0.17;
	const changePercent = ((hash(`${symbol}:change`) % 1200) - 600) / 100;
	const dayLow = Math.max(0.1, price * (0.97 - (base % 3) / 100));
	const dayHigh = price * (1.02 + (base % 4) / 100);
	const week52Low = Math.max(0.1, price * (0.58 + (base % 18) / 100));
	const week52High = price * (1.12 + (base % 24) / 100);
	const volumeLow = 1 + (hash(`${symbol}:volume-low`) % 35);
	const volumeHigh = volumeLow + 15 + (hash(`${symbol}:volume-high`) % 95);
	const volumeCurrent =
		volumeLow + (hash(`${symbol}:volume-current`) % (volumeHigh - volumeLow));
	const peRatio =
		group.asset_class === "equity" || group.asset_class === "etf"
			? 8 + (hash(`${symbol}:pe`) % 720) / 10
			: null;
	const performance = {
		d5: ((hash(`${symbol}:d5`) % 800) - 400) / 100,
		m3: ((hash(`${symbol}:m3`) % 4200) - 1400) / 100,
		y1: ((hash(`${symbol}:y1`) % 16_000) - 3000) / 100,
	};

	return {
		key: `${group.id}:${symbol}`,
		symbol,
		assetClass: group.asset_class,
		price,
		changePercent,
		peRatio,
		dayRange: {
			low: dayLow,
			current: price,
			high: dayHigh,
		},
		week52Range: {
			low: week52Low,
			current: price,
			high: week52High,
		},
		performance,
		averageVolume: {
			low: volumeLow,
			current: volumeCurrent,
			high: volumeHigh,
		},
	};
}

function rangePercent(range: RangeValue) {
	if (range.high <= range.low) {
		return 50;
	}

	return Math.max(
		0,
		Math.min(
			100,
			((range.current - range.low) / (range.high - range.low)) * 100,
		),
	);
}

function hash(value: string) {
	let hashValue = 0;

	for (let index = 0; index < value.length; index += 1) {
		hashValue = (hashValue * 31 + value.charCodeAt(index)) >>> 0;
	}

	return hashValue;
}

function formatAssetClass(assetClass: AssetClass) {
	return assetClass.toUpperCase();
}

function formatGroupName(name: string) {
	return name
		.replace(/\bAi\b/g, "AI")
		.replace(/\bEtf\b/g, "ETF")
		.replace(/\bFx\b/g, "FX");
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

function formatPrice(price: number) {
	return `$${price.toFixed(price >= 100 ? 2 : 3)}`;
}
