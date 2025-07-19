import { DataSource } from "typeorm";
import { ContentSection } from "../models/entities/ContentSection";
import { ContentItem } from "../models/entities/ContentItem";
import { Testimonial } from "../models/entities/Testimonial";
import { FAQ } from "../models/entities/FAQ";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  ssl:
    process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "dev"
      ? { rejectUnauthorized: false }
      : false,
  entities: [ContentSection, ContentItem, Testimonial, FAQ],
  migrations: [__dirname + "/../migrations/*.{js,ts}"],
  subscribers: [__dirname + "/../subscribers/*.{js,ts}"],
});
