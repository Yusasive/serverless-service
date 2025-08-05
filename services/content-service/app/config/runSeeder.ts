import "reflect-metadata";
import { AppDataSource } from "./typeorm.config";
import { InitialSeeder } from "../seeders/initial.seeder";

export const handler = async () => {
  try {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    
    console.log("🌱 Starting database seeding...");

    // Check if data already exists to prevent duplicate seeding
    const contentSectionCount = await AppDataSource
        .getRepository('ContentSection')
        .createQueryBuilder('cs')
        .getCount();

    if (contentSectionCount > 0) {
        console.log('✅ Database already contains data. Seeding skipped.');
        await AppDataSource.destroy();
        return { statusCode: 200, body: "Seeding skipped - data already exists" };
    }

    // Run the seeder
    const initialSeeder = new InitialSeeder(AppDataSource);
    await initialSeeder.run();

    await AppDataSource.destroy();
    console.log("✅ Database seeded successfully.");
    return { statusCode: 200, body: "Database seeded successfully" };
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { statusCode: 500, body: "Seeding failed: " + errorMessage };
  }
}; 