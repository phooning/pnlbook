import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: serial().primaryKey(),
	title: text().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export const sideEnum = pgEnum("trade_side", ["buy", "sell"]);
export const instrumentEnum = pgEnum("instrument_type", [
	"stock",
	"option",
	"cash",
]);

export const accounts = pgTable("accounts", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	broker: text("broker"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
