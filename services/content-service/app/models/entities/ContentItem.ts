import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ContentSection } from "./ContentSection";

@Entity("content_items")
export class ContentItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  section_id!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  image_url!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  link_url!: string;

  @Column({ type: "json", nullable: true })
  metadata!: any;

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @Column({ type: "integer", default: 0 })
  display_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => ContentSection, { onDelete: "CASCADE" })
  @JoinColumn({ name: "section_id" })
  section!: ContentSection;
}
