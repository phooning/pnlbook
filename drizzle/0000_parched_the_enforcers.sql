CREATE TYPE "public"."instrument_type" AS ENUM('equity', 'option', 'cash');--> statement-breakpoint
CREATE TYPE "public"."position_side" AS ENUM('long', 'short');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"broker" text,
	"base_currency" text DEFAULT 'USD' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_pnl" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"trading_date" date NOT NULL,
	"realized_pnl" numeric(20, 2) DEFAULT '0' NOT NULL,
	"unrealized_pnl" numeric(20, 2) DEFAULT '0' NOT NULL,
	"fees" numeric(20, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instruments" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"name" text,
	"type" "instrument_type" NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"instrument_id" integer,
	"symbol" text NOT NULL,
	"instrument_type" "instrument_type" NOT NULL,
	"side" "position_side" NOT NULL,
	"quantity" numeric(20, 6) NOT NULL,
	"average_price" numeric(20, 6) NOT NULL,
	"last_price" numeric(20, 6) NOT NULL,
	"opened_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlist_symbols" (
	"id" serial PRIMARY KEY NOT NULL,
	"watchlist_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watchlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_pnl" ADD CONSTRAINT "daily_pnl_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "watchlist_symbols" ADD CONSTRAINT "watchlist_symbols_watchlist_id_watchlists_id_fk" FOREIGN KEY ("watchlist_id") REFERENCES "public"."watchlists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_pnl_account_date_unique" ON "daily_pnl" USING btree ("account_id","trading_date");--> statement-breakpoint
CREATE UNIQUE INDEX "instruments_symbol_unique" ON "instruments" USING btree ("symbol");--> statement-breakpoint
CREATE UNIQUE INDEX "watchlist_symbols_watchlist_symbol_unique" ON "watchlist_symbols" USING btree ("watchlist_id","symbol");--> statement-breakpoint
CREATE UNIQUE INDEX "watchlists_name_unique" ON "watchlists" USING btree ("name");