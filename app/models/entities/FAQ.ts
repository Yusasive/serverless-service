import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("faqs")
export class FAQ {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  category!: string; // e.g., 'general', 'booth-booking', 'payment', 'event-info'

  @Column({ type: "varchar", length: 500 })
  question!: string;

  @Column({ type: "text" })
  answer!: string;

  @Column({ type: "json", nullable: true })
  metadata!: any; // For storing additional data like links, contact info, etc.

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @Column({ type: "integer", default: 0 })
  display_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
