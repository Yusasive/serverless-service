import "reflect-metadata";
import { AppDataSource } from "./typeorm.config";

export const handler = async () => {
  try {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    console.log("Loaded migrations:", AppDataSource.options.migrations);

    console.log("Database Config:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
    });

    console.log("Loaded entities:", AppDataSource.entityMetadatas.map(e => e.name));
    console.log("Entity tables:", AppDataSource.entityMetadatas.map(e => e.tableName));

    const pendingMigrations = await AppDataSource.showMigrations();
    console.log("📌 Any migrations pending?", pendingMigrations);   

    const appliedMigrations = await AppDataSource.query(
      "SELECT name, timestamp FROM migrations ORDER BY timestamp ASC"
    );
    console.log("📋 Currently applied migrations:", appliedMigrations);

    await AppDataSource.runMigrations();  
    await AppDataSource.destroy();
    console.log("✅ Migrations ran successfully.");
    return { statusCode: 200, body: "Migrations completed" };
  } catch (error) {
    console.error("❌ Migration failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { statusCode: 500, body: "Migration failed: " + errorMessage };
  }
};
