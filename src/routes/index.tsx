import { createFileRoute } from "@tanstack/react-router";

import {
	calendarPnl,
	equityPositions,
	optionPositions,
	type PositionSeed,
	watchlistGroups,
} from "#/data/bootstrap.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="flex min-h-screen bg-black text-neutral-300 antialiased">
			<Sidebar />
			<main className="flex-1 p-6 overflow-y-auto">
				<Calendar />
				<Watchlist />
			</main>
		</div>
	);
}

function Sidebar() {
	return (
		<aside className="w-72 border-r border-neutral-800 p-5 flex flex-col gap-6 bg-neutral-950/50">
			<div>
				<h1 className="text-xl font-bold text-white">PnLBook</h1>
				<p className="text-xs text-neutral-500 uppercase tracking-wider">
					Account Overview
				</p>
			</div>

			<div className="space-y-2 border-b border-neutral-800 pb-4">
				<div className="flex justify-between text-sm">
					<span className="text-neutral-400">Equity</span>
					<span className="text-white font-medium">$152,450.32</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-neutral-400">Cash</span>
					<span className="text-white font-medium">$25,230.00</span>
				</div>
				<div className="flex justify-between text-sm pt-1 border-t border-neutral-800 mt-2">
					<span className="text-neutral-400">Total P&L</span>
					<span className="text-green-500 font-medium">+$4,102.55</span>
				</div>
			</div>

			<div>
				<h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
					Equity Positions
				</h3>
				<div className="space-y-2">
					{equityPositions.map((p) => (
						<PositionRow key={p.symbol} position={p} />
					))}
				</div>
			</div>

			<div>
				<h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
					Options Contracts
				</h3>
				<div className="space-y-2">
					{optionPositions.map((p) => (
						<PositionRow key={p.symbol} position={p} />
					))}
				</div>
			</div>
		</aside>
	);
}

function PositionRow({ position }: { position: PositionSeed }) {
	const pnl = (position.lastPrice - position.averagePrice) * position.quantity;
	const pnlColor = pnl > 0 ? "text-green-500" : "text-red-500";

	return (
		<div className="flex items-center justify-between text-xs bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
			<div>
				<div className="text-white font-medium">{position.symbol}</div>
				<div className="text-neutral-500">
					{position.quantity} @ ${position.averagePrice.toFixed(2)}
				</div>
			</div>
			<div className="text-right">
				<div className="text-white">${position.lastPrice.toFixed(2)}</div>
				<div className={pnlColor}>
					{pnl > 0 ? "+" : ""}
					{pnl.toFixed(2)}
				</div>
			</div>
		</div>
	);
}

function Calendar() {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const offset = 5;
	const leadingCells = [
		"leading-sunday",
		"leading-monday",
		"leading-tuesday",
		"leading-wednesday",
		"leading-thursday",
	].slice(0, offset);
	const cells = [
		...leadingCells.map((key) => ({ key, day: null, pnl: null })),
		...calendarPnl.map((entry) => ({
			key: entry.date,
			day: entry.day,
			pnl: entry.pnl,
		})),
	];
	while (cells.length % 7 !== 0) {
		cells.push({
			key: `trailing-${cells.length}`,
			day: null,
			pnl: null,
		});
	}

	return (
		<section className="mb-10">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-white">November 2026</h2>
				<div className="text-sm text-neutral-400">
					Net Monthly P&L:{" "}
					<span className="text-green-500 font-medium">+$12,402.88</span>
				</div>
			</div>
			<div className="grid grid-cols-7 gap-1.5">
				{days.map((d) => (
					<div
						key={d}
						className="text-center text-xs text-neutral-500 py-1 font-medium"
					>
						{d}
					</div>
				))}
				{cells.map((cell, i) => {
					if (cell.day === null || cell.pnl === null)
						return (
							<div
								key={cell.key}
								className="h-24 bg-neutral-900/20 rounded-md border border-neutral-900"
							></div>
						);

					const isProfit = cell.pnl > 0;
					const isLoss = cell.pnl < 0;
					const isWeekend = i % 7 === 0 || i % 7 === 6;

					return (
						<div
							key={cell.key}
							className={`h-24 p-2 rounded-md border flex flex-col justify-between transition-colors
              ${isProfit ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10" : ""}
              ${isLoss ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10" : ""}
              ${!isProfit && !isLoss ? "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900" : ""}
              ${isWeekend ? "opacity-60" : ""}
            `}
						>
							<div className="text-xs text-neutral-400">{cell.day}</div>
							{cell.pnl !== 0 && (
								<div
									className={`text-xs font-medium ${isProfit ? "text-green-400" : "text-red-400"}`}
								>
									{cell.pnl > 0 ? "+" : ""}${cell.pnl.toFixed(2)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}

// Mock data for the detailed watchlist
const detailedWatchlist = [
	{
		category: "AI Megacap Platforms",
		items: [
			{
				ticker: "NVDA",
				price: 135.2,
				pctChange: 2.45,
				peRatio: 60.5,
				dayRange: [132.1, 135.2, 136.5],
				week52Range: [45.2, 135.2, 140.8],
				perf: { d5: 1.2, m3: 15.4, y1: 180.2 },
				vol: [20, 45, 80],
			},
			{
				ticker: "AAPL",
				price: 165.3,
				pctChange: -0.85,
				peRatio: 28.1,
				dayRange: [164.1, 165.3, 166.8],
				week52Range: [155.0, 165.3, 198.2],
				perf: { d5: -1.5, m3: 2.1, y1: 12.4 },
				vol: [40, 55, 120],
			},
			{
				ticker: "MSFT",
				price: 410.5,
				pctChange: 1.12,
				peRatio: 35.2,
				dayRange: [408.0, 410.5, 412.3],
				week52Range: [350.0, 410.5, 450.2],
				perf: { d5: 0.8, m3: 5.4, y1: 25.1 },
				vol: [15, 22, 50],
			},
			{
				ticker: "GOOG",
				price: 142.8,
				pctChange: 0.35,
				peRatio: 24.9,
				dayRange: [142.1, 142.8, 143.5],
				week52Range: [120.0, 142.8, 155.2],
				perf: { d5: 0.4, m3: 4.1, y1: 18.6 },
				vol: [25, 32, 60],
			},
		],
	},
	{
		category: "Semis Compute Memory",
		items: [
			{
				ticker: "AMD",
				price: 145.2,
				pctChange: -1.2,
				peRatio: 200.5,
				dayRange: [143.5, 145.2, 146.8],
				week52Range: [110.0, 145.2, 190.5],
				perf: { d5: -2.1, m3: -5.4, y1: 12.2 },
				vol: [30, 45, 80],
			},
			{
				ticker: "AVGO",
				price: 1050.4,
				pctChange: 3.15,
				peRatio: 65.2,
				dayRange: [1020.0, 1050.4, 1062.5],
				week52Range: [800.0, 1050.4, 1100.0],
				perf: { d5: 4.2, m3: 12.1, y1: 45.8 },
				vol: [2.5, 4.1, 8.0],
			},
			{
				ticker: "TSM",
				price: 155.6,
				pctChange: 0.85,
				peRatio: 22.1,
				dayRange: [154.2, 155.6, 156.0],
				week52Range: [98.0, 155.6, 160.2],
				perf: { d5: 1.1, m3: 8.2, y1: 35.4 },
				vol: [10, 18, 40],
			},
			{
				ticker: "MU",
				price: 85.3,
				pctChange: -2.05,
				peRatio: 15.4,
				dayRange: [84.5, 85.3, 87.2],
				week52Range: [70.0, 85.3, 95.8],
				perf: { d5: -3.2, m3: -1.1, y1: 22.5 },
				vol: [15, 25, 50],
			},
		],
	},
	{
		category: "Core Index ETFs",
		items: [
			{
				ticker: "SPY",
				price: 450.2,
				pctChange: 0.42,
				peRatio: 24.5,
				dayRange: [448.5, 450.2, 450.8],
				week52Range: [410.0, 450.2, 460.5],
				perf: { d5: 0.5, m3: 3.1, y1: 15.2 },
				vol: [50, 75, 120],
			},
			{
				ticker: "QQQ",
				price: 390.5,
				pctChange: 0.85,
				peRatio: 28.2,
				dayRange: [388.0, 390.5, 391.2],
				week52Range: [350.0, 390.5, 405.0],
				perf: { d5: 1.1, m3: 4.5, y1: 22.8 },
				vol: [30, 45, 80],
			},
			{
				ticker: "IWM",
				price: 195.4,
				pctChange: -0.35,
				peRatio: null,
				dayRange: [194.8, 195.4, 196.2],
				week52Range: [160.0, 195.4, 210.5],
				perf: { d5: -0.8, m3: 1.2, y1: 8.5 },
				vol: [15, 22, 40],
			},
		],
	},
];

// Helper component to render price/volume ranges
function RangeBar({
	low,
	current,
	high,
	format,
}: {
	low: number;
	current: number;
	high: number;
	format?: (n: number) => string;
}) {
	const pct = Math.max(
		0,
		Math.min(100, ((current - low) / (high - low)) * 100),
	);
	const fmt = format || ((n: number) => n.toFixed(0));

	return (
		<div className="flex items-center gap-2 w-32">
			<span className="text-[10px] text-neutral-500 w-8 text-right">
				{fmt(low)}
			</span>
			<div className="relative flex-1 h-1 bg-neutral-800 rounded-full">
				<div
					className="absolute h-3 w-0.5 bg-white top-1/2 -translate-y-1/2"
					style={{ left: `calc(${pct}% - 1px)` }}
				/>
			</div>
			<span className="text-[10px] text-neutral-500 w-8">{fmt(high)}</span>
		</div>
	);
}

// Helper component specifically for volume ranges
function VolumeBar({
	low,
	current,
	high,
}: {
	low: number;
	current: number;
	high: number;
}) {
	const pct = Math.max(
		0,
		Math.min(100, ((current - low) / (high - low)) * 100),
	);

	return (
		<div className="flex flex-col gap-1 w-28">
			<div className="text-[10px] text-blue-400 text-center font-medium">
				{current.toFixed(1)}M
			</div>
			<div className="relative h-1 bg-neutral-800 rounded-full">
				<div
					className="absolute h-full bg-blue-500/60 rounded-full"
					style={{ width: `${pct}%` }}
				/>
			</div>
			<div className="flex justify-between text-[10px] text-neutral-600">
				<span>{low}M</span>
				<span>{high}M</span>
			</div>
		</div>
	);
}

function Watchlist() {
	return (
		<section>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-white">Watchlist Universe</h2>
				<span className="text-xs text-neutral-500">
					Promotion Candidates & Macro Core
				</span>
			</div>

			<div className="space-y-6">
				{detailedWatchlist.map((group) => (
					<div
						key={group.category}
						className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden"
					>
						<h3 className="text-xs uppercase tracking-wider text-neutral-400 bg-neutral-900/80 px-4 py-2 border-b border-neutral-800">
							{group.category}
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-800">
										<th className="px-4 py-2 font-medium">Ticker</th>
										<th className="px-4 py-2 font-medium text-right">Price</th>
										<th className="px-4 py-2 font-medium text-right">Chg%</th>
										<th className="px-4 py-2 font-medium text-right">P/E</th>
										<th className="px-4 py-2 font-medium">Day Range</th>
										<th className="px-4 py-2 font-medium">52W Range</th>
										<th className="px-4 py-2 font-medium">5d / 3m / 1y</th>
										<th className="px-4 py-2 font-medium">Avg Vol</th>
									</tr>
								</thead>
								<tbody>
									{group.items.map((item) => {
										const isUp = item.pctChange > 0;
										const pnlColor = isUp ? "text-green-400" : "text-red-400";

										return (
											<tr
												key={item.ticker}
												className="text-xs border-b border-neutral-900/50 hover:bg-neutral-800/20 transition-colors"
											>
												<td className="px-4 py-3 font-semibold text-white">
													{item.ticker}
												</td>
												<td className="px-4 py-3 text-right text-neutral-200">
													${item.price.toFixed(2)}
												</td>
												<td
													className={`px-4 py-3 text-right font-medium ${pnlColor}`}
												>
													{isUp ? "+" : ""}
													{item.pctChange.toFixed(2)}%
												</td>
												<td className="px-4 py-3 text-right text-neutral-400">
													{item.peRatio ? item.peRatio.toFixed(1) : "-"}
												</td>
												<td className="px-4 py-3">
													<RangeBar
														low={item.dayRange[0]}
														current={item.dayRange[1]}
														high={item.dayRange[2]}
														format={(n) => `$${n.toFixed(1)}`}
													/>
												</td>
												<td className="px-4 py-3">
													<RangeBar
														low={item.week52Range[0]}
														current={item.week52Range[1]}
														high={item.week52Range[2]}
														format={(n) => `$${n.toFixed(0)}`}
													/>
												</td>
												<td className="px-4 py-3">
													<div className="flex gap-3 text-[10px] text-neutral-400">
														<span
															className={
																item.perf.d5 >= 0
																	? "text-green-400"
																	: "text-red-400"
															}
														>
															{item.perf.d5 > 0 ? "+" : ""}
															{item.perf.d5}%
														</span>
														<span className="text-neutral-600">/</span>
														<span
															className={
																item.perf.m3 >= 0
																	? "text-green-400"
																	: "text-red-400"
															}
														>
															{item.perf.m3 > 0 ? "+" : ""}
															{item.perf.m3}%
														</span>
														<span className="text-neutral-600">/</span>
														<span
															className={
																item.perf.y1 >= 0
																	? "text-green-400"
																	: "text-red-400"
															}
														>
															{item.perf.y1 > 0 ? "+" : ""}
															{item.perf.y1}%
														</span>
													</div>
												</td>
												<td className="px-4 py-3">
													<VolumeBar
														low={item.vol[0]}
														current={item.vol[1]}
														high={item.vol[2]}
													/>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
