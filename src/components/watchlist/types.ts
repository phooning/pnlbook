export type AssetClass =
	| "equity"
	| "etf"
	| "fund"
	| "index"
	| "crypto"
	| "futures";

export type SortDirection = "asc" | "desc";

export type ColumnId =
	| "symbol"
	| "price"
	| "changePercent"
	| "peRatio"
	| "dayRange"
	| "week52Range"
	| "performance"
	| "averageVolume"
	| "assetClass";

export type UniverseWatchlist = {
	id: string;
	name: string;
	source_table: string;
	asset_class: AssetClass;
	namespace: string;
	theme: string;
	symbols: Array<string>;
	items?: Array<UniverseWatchlistItem>;
};

export type UniverseWatchlistItem = {
	symbol: string;
	name?: {
		display?: string | null;
		official?: string | null;
		short?: string | null;
	};
};

export type Universe = {
	generated_at_utc: string;
	meta: {
		philosophy: string;
	};
	watchlists: Array<UniverseWatchlist>;
};

export type RangeValue = {
	low: number;
	current: number;
	high: number;
};

export type PerformanceValue = {
	d5: number;
	m3: number;
	y1: number;
};

export type WatchlistRow = {
	key: string;
	symbol: string;
	displayName: string;
	officialName: string;
	assetClass: AssetClass;
	price: number;
	changePercent: number;
	peRatio: number | null;
	dayRange: RangeValue;
	week52Range: RangeValue;
	performance: PerformanceValue;
	averageVolume: RangeValue;
};

export type ColumnDefinition = {
	id: ColumnId;
	label: string;
	defaultWidth: number;
	minWidth: number;
	align?: "right";
	sortable?: boolean;
};

export type SortState = {
	columnId: ColumnId;
	direction: SortDirection;
};

export type CollapsedGroups = Record<string, boolean>;

export type WatchlistGroup = UniverseWatchlist & { rows: Array<WatchlistRow> };
