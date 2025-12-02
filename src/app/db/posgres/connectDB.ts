import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import logger from "../../utils/logger";
import { env } from "../../config/env";

let db: NodePgDatabase | null = null;
let pool: Pool | null = null;

export const connectDB = async (): Promise<void> => {
    if (db) {
        logger.debug("⚡ PostgreSQL already initialized — skipping reconnect.");
        return;
    }

    try {
        const POSTGRES_URL = env.POSTGRES_URI;
        if (!POSTGRES_URL) throw new Error("POSTGRES_URL is missing in .env");

        // Create connection pool once (Singleton)
        pool = new Pool({
            connectionString: POSTGRES_URL,
            max: 10,
            idleTimeoutMillis: 30000,
        });

        // Test connection
        await pool.query("SELECT 1");

        // Initialize Drizzle ORM
        db = drizzle(pool);

        logger.info("🐘 PostgreSQL connected");
        logger.debug(`🔌 DB URL: ${POSTGRES_URL}`);

        // Event hooks
        pool.on("error", (err) => logger.error(`💥 PostgreSQL Pool Error: ${err.message}`));
        pool.on("connect", () => logger.debug("🔗 New PostgreSQL client connected"));
        pool.on("remove", () => logger.warn("⚠️ PostgreSQL client removed"));

    } catch (err: any) {
        logger.error(`❌ Failed to connect PostgreSQL: ${err.message}`);
        throw err;
    }
};

export const getDB = (): NodePgDatabase => {
    if (!db) throw new Error("❌ Database not initialized. Call connectDB() first.");
    return db;
};
