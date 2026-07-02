import { Plus, X } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";

import type { WatchlistRow } from "./types.ts";
import { defaultPrimarySymbols } from "./watchlist-model.ts";
import {
	formatAssetClass,
	formatPrice,
	getSymbolLabel,
	hashString,
} from "./watchlist-utils.ts";

export function PrimaryWatchlist({
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
					<div
						className="font-semibold text-white text-lg leading-none"
						title={getSymbolLabel(row)}
					>
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
		const wobble =
			((hashString(`${row.symbol}:spark:${index}`) % 100) - 50) / 100;
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
