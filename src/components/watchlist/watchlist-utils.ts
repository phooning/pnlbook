import type {
	AssetClass,
	ColumnId,
	RangeValue,
	SortState,
	WatchlistRow,
} from "./types.ts";

export function sortRows(rows: Array<WatchlistRow>, sort: SortState) {
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

export function getSearchText(row: WatchlistRow) {
	return `${row.symbol} ${row.displayName} ${row.officialName} ${row.assetClass}`.toLowerCase();
}

export function getSymbolLabel(row: WatchlistRow) {
	if (row.displayName && row.displayName !== row.symbol) {
		return row.displayName;
	}

	return row.officialName || row.symbol;
}

export function rangePercent(range: RangeValue) {
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

export function formatAssetClass(assetClass: AssetClass) {
	return assetClass.toUpperCase();
}

export function formatGroupName(name: string) {
	return name
		.replace(/\bAi\b/g, "AI")
		.replace(/\bEtf\b/g, "ETF")
		.replace(/\bFx\b/g, "FX");
}

export function formatPrice(price: number) {
	return `$${price.toFixed(price >= 100 ? 2 : 3)}`;
}

export function hashString(value: string) {
	let hashValue = 0;

	for (let index = 0; index < value.length; index += 1) {
		hashValue = (hashValue * 31 + value.charCodeAt(index)) >>> 0;
	}

	return hashValue;
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
