import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema.ts";

export function getDb() {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL is required before using the PnLBook database",
		);
	}

	return drizzle(databaseUrl, { schema });
}

export type Db = ReturnType<typeof getDb>;
