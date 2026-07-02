import {
	boolean,
	date,
	integer,
	numeric,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const instrumentTypeEnum = pgEnum("instrument_type", [
	"equity",
	"option",
	"cash",
]);
export const positionSideEnum = pgEnum("position_side", ["long", "short"]);

export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	broker: text("broker"),
	baseCurrency: text("base_currency").default("USD").notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const instruments = pgTable(
	"instruments",
	{
		id: serial("id").primaryKey(),
		symbol: text("symbol").notNull(),
		name: text("name"),
		type: instrumentTypeEnum("type").notNull(),
		currency: text("currency").default("USD").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [uniqueIndex("instruments_symbol_unique").on(table.symbol)],
);

export const positions = pgTable("positions", {
	id: serial("id").primaryKey(),
	accountId: integer("account_id")
		.references(() => accounts.id)
		.notNull(),
	instrumentId: integer("instrument_id").references(() => instruments.id),
	symbol: text("symbol").notNull(),
	instrumentType: instrumentTypeEnum("instrument_type").notNull(),
	side: positionSideEnum("side").notNull(),
	quantity: numeric("quantity", { precision: 20, scale: 6 }).notNull(),
	averagePrice: numeric("average_price", { precision: 20, scale: 6 }).notNull(),
	lastPrice: numeric("last_price", { precision: 20, scale: 6 }).notNull(),
	openedAt: timestamp("opened_at"),
	closedAt: timestamp("closed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyPnl = pgTable(
	"daily_pnl",
	{
		id: serial("id").primaryKey(),
		accountId: integer("account_id")
			.references(() => accounts.id)
			.notNull(),
		tradingDate: date("trading_date").notNull(),
		realizedPnl: numeric("realized_pnl", { precision: 20, scale: 2 })
			.default("0")
			.notNull(),
		unrealizedPnl: numeric("unrealized_pnl", { precision: 20, scale: 2 })
			.default("0")
			.notNull(),
		fees: numeric("fees", { precision: 20, scale: 2 }).default("0").notNull(),
		notes: text("notes"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("daily_pnl_account_date_unique").on(
			table.accountId,
			table.tradingDate,
		),
	],
);

export const watchlists = pgTable(
	"watchlists",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [uniqueIndex("watchlists_name_unique").on(table.name)],
);

export const watchlistSymbols = pgTable(
	"watchlist_symbols",
	{
		id: serial("id").primaryKey(),
		watchlistId: integer("watchlist_id")
			.references(() => watchlists.id)
			.notNull(),
		symbol: text("symbol").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("watchlist_symbols_watchlist_symbol_unique").on(
			table.watchlistId,
			table.symbol,
		),
	],
);
