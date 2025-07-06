import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content_sections')
export class ContentSection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  section_key!: string; // e.g., 'hero', 'about', 'features', 'testimonials', 'events'

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'json', nullable: true })
  metadata!: any;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'integer', default: 0 })
  display_order!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
