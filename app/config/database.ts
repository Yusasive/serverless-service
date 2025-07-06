import { DataSource } from "typeorm";
import { ContentSection } from "../models/entities/ContentSection";
import { ContentItem } from "../models/entities/ContentItem";
import { Testimonial } from "../models/entities/Testimonial";
import { FAQ } from "../models/entities/FAQ";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "litf-db-content-service",
  synchronize: process.env.NODE_ENV === "development", // Only for development
  logging: process.env.NODE_ENV === "development",
  entities: [ContentSection, ContentItem, Testimonial, FAQ],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  subscribers: [__dirname + "/../subscribers/*.{js,ts}"],
});