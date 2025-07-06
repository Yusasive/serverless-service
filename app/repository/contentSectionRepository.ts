import { Repository } from 'typeorm';
import { ContentSection } from '../models/entities/ContentSection';
import { AppDataSource } from '../config/database';

export class ContentSectionRepository {
  private repository: Repository<ContentSection>;

  constructor() {
    this.repository = AppDataSource.getRepository(ContentSection);
  }

  async findAll(): Promise<ContentSection[]> {
    return await this.repository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }

  async findByKey(section_key: string): Promise<ContentSection | null> {
    return await this.repository.findOne({
      where: { section_key, is_active: true },
    });
  }

  async findById(id: string): Promise<ContentSection | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(data: Partial<ContentSection>): Promise<ContentSection> {
    const contentSection = this.repository.create(data);
    return await this.repository.save(contentSection);
  }

  async update(id: string, data: Partial<ContentSection>): Promise<ContentSection | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAllForAdmin(): Promise<ContentSection[]> {
    return await this.repository.find({
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }
}