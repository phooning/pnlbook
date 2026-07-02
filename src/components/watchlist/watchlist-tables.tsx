import { ChevronDown, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "#/components/ui/button.tsx";

import type {
	ColumnDefinition,
	ColumnId,
	PerformanceValue,
	RangeValue,
	SortDirection,
	SortState,
	WatchlistGroup,
	WatchlistRow,
} from "./types.ts";
import { columns, defaultColumnWidths } from "./watchlist-columns.ts";
import {
	formatGroupName,
	formatPrice,
	getSymbolLabel,
	rangePercent,
	sortRows,
} from "./watchlist-utils.ts";

export function SearchResultsTable({
	rows,
	searchQuery,
	primarySymbolSet,
	onTogglePrimarySymbol,
}: {
	rows: Array<WatchlistRow>;
	searchQuery: string;
	primarySymbolSet: Set<string>;
	onTogglePrimarySymbol: (symbol: string) => void;
}) {
	const [sort, setSort] = useState<SortState>({
		columnId: "symbol",
		direction: "asc",
	});
	const [columnWidths, setColumnWidths] =
		useState<Record<ColumnId, number>>(defaultColumnWidths);
	const sortedRows = useMemo(() => sortRows(rows, sort), [rows, sort]);
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
		<div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/80 px-4 py-2">
				<div>
					<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
						Search Results
					</h3>
					<div className="mt-0.5 text-[10px] text-neutral-600">
						{searchQuery}
					</div>
				</div>
				<span className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-500">
					{rows.length} matches
				</span>
			</div>

			{rows.length > 0 ? (
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
									key={row.symbol}
									row={row}
									isPrimary={primarySymbolSet.has(row.symbol)}
									onTogglePrimarySymbol={onTogglePrimarySymbol}
								/>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="px-4 py-8 text-center text-sm text-neutral-500">
					No matches
				</div>
			)}
		</div>
	);
}

export function WatchlistGroupTable({
	group,
	isCollapsed,
	primarySymbolSet,
	onToggleCollapsed,
	onTogglePrimarySymbol,
	getGroupDomId,
}: {
	group: WatchlistGroup;
	isCollapsed: boolean;
	primarySymbolSet: Set<string>;
	onToggleCollapsed: (groupId: string) => void;
	onTogglePrimarySymbol: (symbol: string) => void;
	getGroupDomId: (groupId: string) => string;
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
					<span
						className="font-semibold text-white"
						title={getSymbolLabel(row)}
					>
						{row.symbol}
					</span>
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
			<PerformanceCellValue value={performance.d5} />
			<span className="text-neutral-700">/</span>
			<PerformanceCellValue value={performance.m3} />
			<span className="text-neutral-700">/</span>
			<PerformanceCellValue value={performance.y1} />
		</div>
	);
}

function PerformanceCellValue({ value }: { value: number }) {
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
