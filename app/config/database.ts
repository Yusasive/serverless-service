import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { ContentSection } from "../models/entities/ContentSection";
import { ContentItem } from "../models/entities/ContentItem";
import { Testimonial } from "../models/entities/Testimonial";
import { FAQ } from "../models/entities/FAQ";
import * as dotenv from "dotenv";

// Load env variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "prod";
const isDevelopment = process.env.NODE_ENV === "development";

const dbConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: isDevelopment,
  logging: isDevelopment,
  ssl:
    isProduction || process.env.NODE_ENV === "dev"
      ? { rejectUnauthorized: false }
      : false,
  entities: [ContentSection, ContentItem, Testimonial, FAQ],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  subscribers: [__dirname + "/../subscribers/*.{js,ts}"],
  extra: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
};

// Create a DataSource instance (can be reused across invocations)
let dataSource: DataSource | null = null;

const initializeDb = async (): Promise<DataSource> => {
  try {
    if (!dataSource) {
      dataSource = new DataSource(dbConfig);
      await dataSource.initialize();
      console.log("Database connection initialized");
    } else if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log("Database connection re-initialized");
    }
    return dataSource;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export { dbConfig, dataSource, initializeDb };
  
