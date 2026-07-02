import type { ColumnDefinition, ColumnId } from "./types.ts";

export const columns: Array<ColumnDefinition> = [
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

export const defaultColumnWidths = columns.reduce<Record<ColumnId, number>>(
	(widths, column) => {
		widths[column.id] = column.defaultWidth;
		return widths;
	},
	{} as Record<ColumnId, number>,
);
