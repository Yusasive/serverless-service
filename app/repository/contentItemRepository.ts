import { Repository } from 'typeorm';
import { ContentItem } from '../models/entities/ContentItem';
import { AppDataSource } from '../config/database';

export class ContentItemRepository {
  private repository: Repository<ContentItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(ContentItem);
  }

  async findAll(): Promise<ContentItem[]> {
    return await this.repository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', created_at: 'ASC' },
      relations: ['section'],
    });
  }

  async findBySectionId(section_id: string): Promise<ContentItem[]> {
    return await this.repository.find({
      where: { section_id, is_active: true },
      order: { display_order: 'ASC', created_at: 'ASC' },
      relations: ['section'],
    });
  }

  async findById(id: string): Promise<ContentItem | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['section'],
    });
  }

  async create(data: Partial<ContentItem>): Promise<ContentItem> {
    const contentItem = this.repository.create(data);
    return await this.repository.save(contentItem);
  }

  async update(id: string, data: Partial<ContentItem>): Promise<ContentItem | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAllForAdmin(): Promise<ContentItem[]> {
    return await this.repository.find({
      order: { display_order: 'ASC', created_at: 'ASC' },
      relations: ['section'],
    });
  }
}