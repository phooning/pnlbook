import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

// --- Dummy Data Scaffolding ---

const equityPositions = [
	{ ticker: "NVDA", qty: 100, avg: 120.45, last: 135.2 },
	{ ticker: "AAPL", qty: 50, avg: 170.1, last: 165.3 },
	{ ticker: "TSLA", qty: -30, avg: 240.0, last: 230.5 },
	{ ticker: "PLTR", qty: 200, avg: 32.1, last: 35.8 },
];

const optionPositions = [
	{ ticker: "SPY 11/15 C 450", qty: 5, avg: 2.15, last: 3.05 },
	{ ticker: "QQQ 11/15 P 400", qty: 10, avg: 1.8, last: 1.2 },
	{ ticker: "NVDA 12/20 C 150", qty: 3, avg: 8.5, last: 10.2 },
];

const calendarPnl = [
	-120.5, 450.1, 0, 320.0, -85.2, 1200.5, 890.0, -540.0, 120.5, 0, 0, 650.3,
	-210.0, 45.5, 980.0, 1500.0, -320.0, 0, 210.5, 450.0, -670.0, 340.0, 0, 0,
	890.0, 1200.0, -450.0, 230.0, 0, 110.5,
];

const watchlistGroups = [
	{
		category: "AI Megacap Platforms",
		tickers: ["AAPL", "AMZN", "GOOG", "META", "MSFT", "TSLA", "NVDA", "IBM"],
	},
	{
		category: "Semis Compute Memory",
		tickers: [
			"NVDA",
			"AMD",
			"AVGO",
			"MRVL",
			"MU",
			"QCOM",
			"INTC",
			"ARM",
			"TSM",
			"ASML",
			"SMCI",
		],
	},
	{
		category: "AI Power & DC Infra",
		tickers: [
			"VRT",
			"ETN",
			"GEV",
			"CEG",
			"BE",
			"FLNC",
			"APLD",
			"CORZ",
			"IREN",
			"CLSK",
		],
	},
	{
		category: "Software & Cloud Security",
		tickers: [
			"ORCL",
			"PLTR",
			"NOW",
			"DDOG",
			"NET",
			"CRM",
			"NFLX",
			"SNOW",
			"OKTA",
			"ZS",
		],
	},
	{
		category: "Space & Defense",
		tickers: [
			"LMT",
			"RTX",
			"NOC",
			"GD",
			"BA",
			"TDY",
			"KTOS",
			"AVAV",
			"RKLB",
			"LUNR",
		],
	},
	{
		category: "Energy Integrated",
		tickers: [
			"XOM",
			"CVX",
			"COP",
			"EOG",
			"OXY",
			"VLO",
			"MPC",
			"PSX",
			"SLB",
			"HAL",
		],
	},
	{
		category: "Quantum & Nuclear Frontier",
		tickers: ["IONQ", "OKLO", "VOYG", "NBIS", "SERV", "SKYT"],
	},
	{
		category: "Core Index ETFs",
		tickers: ["SPY", "VOO", "VTI", "QQQ", "VUG", "IWM", "DIA", "TQQQ"],
	},
];

// --- Components ---

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
						<PositionRow key={p.ticker} {...p} />
					))}
				</div>
			</div>

			<div>
				<h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
					Options Contracts
				</h3>
				<div className="space-y-2">
					{optionPositions.map((p) => (
						<PositionRow key={p.ticker} {...p} />
					))}
				</div>
			</div>
		</aside>
	);
}

function PositionRow({
	ticker,
	qty,
	avg,
	last,
}: {
	ticker: string;
	qty: number;
	avg: number;
	last: number;
}) {
	const pnl = (last - avg) * qty;
	const pnlColor = pnl > 0 ? "text-green-500" : "text-red-500";

	return (
		<div className="flex items-center justify-between text-xs bg-neutral-900 border border-neutral-800 rounded px-3 py-2">
			<div>
				<div className="text-white font-medium">{ticker}</div>
				<div className="text-neutral-500">
					{qty} @ ${avg.toFixed(2)}
				</div>
			</div>
			<div className="text-right">
				<div className="text-white">${last.toFixed(2)}</div>
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
	// Simulating a month starting on a Friday (offset 5)
	const offset = 5;
	const cells = [
		...Array(offset).fill(null),
		...calendarPnl.map((pnl, i) => ({ day: i + 1, pnl })),
	];
	// Pad to complete the grid
	while (cells.length % 7 !== 0) cells.push(null);

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
					if (!cell)
						return (
							<div
								key={i}
								className="h-24 bg-neutral-900/20 rounded-md border border-neutral-900"
							></div>
						);

					const isProfit = cell.pnl > 0;
					const isLoss = cell.pnl < 0;
					const isWeekend = i % 7 === 0 || i % 7 === 6;

					return (
						<div
							key={i}
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

function Watchlist() {
	return (
		<section>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-white">Watchlist Universe</h2>
				<span className="text-xs text-neutral-500">
					Promotion Candidates & Macro Core
				</span>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{watchlistGroups.map((group) => (
					<div
						key={group.category}
						className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4"
					>
						<h3 className="text-xs uppercase tracking-wider text-neutral-400 mb-3 border-b border-neutral-800 pb-2">
							{group.category}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.tickers.map((ticker, idx) => {
								// Hardcoded alternating states for visual variety
								const state =
									idx % 3 === 0 ? "up" : idx % 3 === 1 ? "down" : "neutral";
								return (
									<div
										key={ticker}
										className={`text-xs px-2 py-1 rounded border font-medium transition-colors cursor-pointer
                      ${
												state === "up"
													? "border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10"
													: ""
											}
                      ${
												state === "down"
													? "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10"
													: ""
											}
                      ${
												state === "neutral"
													? "border-neutral-700 text-neutral-300 bg-neutral-800/50 hover:bg-neutral-800"
													: ""
											}
                    `}
									>
										{ticker}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
