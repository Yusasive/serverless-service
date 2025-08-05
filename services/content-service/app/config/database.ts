import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { ContentSection } from "../models/entities/ContentSection";
import { ContentItem } from "../models/entities/ContentItem";
import { Testimonial } from "../models/entities/Testimonial";
import { FAQ } from "../models/entities/FAQ";
import * as dotenv from "dotenv";
import { container } from "tsyringe";

dotenv.config();

const dbConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV !== "prod",
    ssl: process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "dev" ? {
      rejectUnauthorized: false
  } : false,
  entities: [ContentSection, ContentItem, Testimonial, FAQ],
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
};

// Create a singleton instance of the DataSource
let dataSource: DataSource | null = null;
const AppDataSource = new DataSource(dbConfig);

// Initialize database connection
const initializeDb = async () => {
  try {
    if (!dataSource) {
      dataSource = new DataSource(dbConfig);
      await dataSource.initialize();
      // Register the DataSource with tsyringe after initialization
      container.register("DataSource", {
        useValue: dataSource,
      });
      console.log("Database connection initialized");
    } else if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log("Database connection re-initialized");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export { dataSource, dbConfig, initializeDb };
export default AppDataSource; 
