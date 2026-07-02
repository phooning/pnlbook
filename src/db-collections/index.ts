import {
	createCollection,
	localOnlyCollectionOptions,
} from "@tanstack/react-db";
import { z } from "zod";

const PositionSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	symbol: z.string().min(1),
	instrumentType: z.enum(["equity", "option", "cash"]),
	quantity: z.number(),
	averagePrice: z.number(),
	lastPrice: z.number(),
});

const DailyPnlSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	date: z.iso.date(),
	realizedPnl: z.number().default(0),
	unrealizedPnl: z.number().default(0),
	fees: z.number().default(0),
	notes: z.string().optional(),
});

const WatchlistSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	symbols: z.array(z.string().min(1)),
});

export type Position = z.infer<typeof PositionSchema>;
export type DailyPnl = z.infer<typeof DailyPnlSchema>;
export type Watchlist = z.infer<typeof WatchlistSchema>;

export const positionsCollection = createCollection(
	localOnlyCollectionOptions({
		getKey: (position) => position.id,
		schema: PositionSchema,
	}),
);

export const dailyPnlCollection = createCollection(
	localOnlyCollectionOptions({
		getKey: (entry) => entry.id,
		schema: DailyPnlSchema,
	}),
);

export const watchlistsCollection = createCollection(
	localOnlyCollectionOptions({
		getKey: (watchlist) => watchlist.id,
		schema: WatchlistSchema,
	}),
);
