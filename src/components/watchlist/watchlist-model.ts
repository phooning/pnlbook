import universe from "#/constants/universe.json";

import type {
	AssetClass,
	Universe,
	UniverseWatchlist,
	UniverseWatchlistItem,
	WatchlistGroup,
	WatchlistRow,
} from "./types.ts";
import { hashString } from "./watchlist-utils.ts";

const assetClassOrder: Array<AssetClass> = [
	"equity",
	"etf",
	"fund",
	"index",
	"crypto",
	"futures",
];

export const universeData = universe as Universe;

export const watchlistSections = assetClassOrder
	.map((assetClass) => {
		const groups = universeData.watchlists
			.filter((group) => group.asset_class === assetClass)
			.map((group) => {
				const itemsBySymbol = new Map(
					(group.items ?? []).map((item) => [item.symbol, item]),
				);

				return {
					...group,
					rows: group.symbols.map((symbol, index) =>
						buildPlaceholderRow(
							symbol,
							group,
							index,
							itemsBySymbol.get(symbol),
						),
					),
				};
			});

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

export const totalMemberships = universeData.watchlists.reduce(
	(total, group) => total + group.symbols.length,
	0,
);

export const uniqueSymbols = new Set(
	universeData.watchlists.flatMap((group) => group.symbols),
).size;

export const universeRows = watchlistSections.flatMap((section) =>
	section.groups.flatMap((group: WatchlistGroup) => group.rows),
);

export const rowsBySymbol = universeRows.reduce<Map<string, WatchlistRow>>(
	(rows, row) => {
		if (!rows.has(row.symbol)) {
			rows.set(row.symbol, row);
		}

		return rows;
	},
	new Map(),
);

export const defaultPrimarySymbols = [
	"SPY",
	"QQQ",
	"AAPL",
	"MSFT",
	"NVDA",
].filter((symbol) => rowsBySymbol.has(symbol));

function buildPlaceholderRow(
	symbol: string,
	group: UniverseWatchlist,
	index: number,
	item?: UniverseWatchlistItem,
): WatchlistRow {
	const base = hashString(`${group.id}:${symbol}`);
	const displayName =
		item?.name?.display?.trim() ||
		item?.name?.short?.trim() ||
		item?.name?.official?.trim() ||
		symbol;
	const officialName =
		item?.name?.official?.trim() || item?.name?.display?.trim() || displayName;
	const priceBase = group.asset_class === "crypto" ? 15_000 : 20;
	const priceRange = group.asset_class === "futures" ? 450 : 520;
	const price = priceBase + (base % priceRange) + index * 0.17;
	const changePercent = ((hashString(`${symbol}:change`) % 1200) - 600) / 100;
	const dayLow = Math.max(0.1, price * (0.97 - (base % 3) / 100));
	const dayHigh = price * (1.02 + (base % 4) / 100);
	const week52Low = Math.max(0.1, price * (0.58 + (base % 18) / 100));
	const week52High = price * (1.12 + (base % 24) / 100);
	const volumeLow = 1 + (hashString(`${symbol}:volume-low`) % 35);
	const volumeHigh =
		volumeLow + 15 + (hashString(`${symbol}:volume-high`) % 95);
	const volumeCurrent =
		volumeLow +
		(hashString(`${symbol}:volume-current`) % (volumeHigh - volumeLow));
	const peRatio =
		group.asset_class === "equity" || group.asset_class === "etf"
			? 8 + (hashString(`${symbol}:pe`) % 720) / 10
			: null;
	const performance = {
		d5: ((hashString(`${symbol}:d5`) % 800) - 400) / 100,
		m3: ((hashString(`${symbol}:m3`) % 4200) - 1400) / 100,
		y1: ((hashString(`${symbol}:y1`) % 16_000) - 3000) / 100,
	};

	return {
		key: `${group.id}:${symbol}`,
		symbol,
		displayName,
		officialName,
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
