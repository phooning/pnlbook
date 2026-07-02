export type PositionSeed = {
	symbol: string;
	quantity: number;
	averagePrice: number;
	lastPrice: number;
	instrumentType: "equity" | "option";
};

export type CalendarPnlSeed = {
	date: string;
	day: number;
	pnl: number;
};

export type WatchlistGroupSeed = {
	name: string;
	symbols: Array<string>;
};

export const equityPositions: Array<PositionSeed> = [
	{
		symbol: "NVDA",
		quantity: 100,
		averagePrice: 120.45,
		lastPrice: 135.2,
		instrumentType: "equity",
	},
	{
		symbol: "AAPL",
		quantity: 50,
		averagePrice: 170.1,
		lastPrice: 165.3,
		instrumentType: "equity",
	},
	{
		symbol: "TSLA",
		quantity: -30,
		averagePrice: 240,
		lastPrice: 230.5,
		instrumentType: "equity",
	},
	{
		symbol: "PLTR",
		quantity: 200,
		averagePrice: 32.1,
		lastPrice: 35.8,
		instrumentType: "equity",
	},
];

export const optionPositions: Array<PositionSeed> = [
	{
		symbol: "SPY 2026-11-15 C450",
		quantity: 5,
		averagePrice: 2.15,
		lastPrice: 3.05,
		instrumentType: "option",
	},
	{
		symbol: "QQQ 2026-11-15 P400",
		quantity: 10,
		averagePrice: 1.8,
		lastPrice: 1.2,
		instrumentType: "option",
	},
	{
		symbol: "NVDA 2026-12-20 C150",
		quantity: 3,
		averagePrice: 8.5,
		lastPrice: 10.2,
		instrumentType: "option",
	},
];

const novemberPnl = [
	-120.5, 450.1, 0, 320, -85.2, 1200.5, 890, -540, 120.5, 0, 0, 650.3, -210,
	45.5, 980, 1500, -320, 0, 210.5, 450, -670, 340, 0, 0, 890, 1200, -450, 230,
	0, 110.5,
];

export const calendarPnl: Array<CalendarPnlSeed> = novemberPnl.map(
	(pnl, index) => ({
		date: `2026-11-${String(index + 1).padStart(2, "0")}`,
		day: index + 1,
		pnl,
	}),
);

export const watchlistGroups: Array<WatchlistGroupSeed> = [
	{
		name: "AI Megacap Platforms",
		symbols: ["AAPL", "AMZN", "GOOG", "META", "MSFT", "TSLA", "NVDA", "IBM"],
	},
	{
		name: "Semis Compute Memory",
		symbols: [
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
		name: "AI Power & DC Infra",
		symbols: [
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
		name: "Software & Cloud Security",
		symbols: [
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
		name: "Space & Defense",
		symbols: [
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
		name: "Energy Integrated",
		symbols: [
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
		name: "Quantum & Nuclear Frontier",
		symbols: ["IONQ", "OKLO", "VOYG", "NBIS", "SERV", "SKYT"],
	},
	{
		name: "Core Index ETFs",
		symbols: ["SPY", "VOO", "VTI", "QQQ", "VUG", "IWM", "DIA", "TQQQ"],
	},
];
