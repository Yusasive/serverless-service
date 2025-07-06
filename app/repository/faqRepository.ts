import { Repository } from 'typeorm';
import { FAQ } from '../models/entities/FAQ';
import { AppDataSource } from '../config/database';

export class FAQRepository {
  private repository: Repository<FAQ>;

  constructor() {
    this.repository = AppDataSource.getRepository(FAQ);
  }

  async findAll(): Promise<FAQ[]> {
    return await this.repository.find({
      where: { is_active: true },
      order: { category: 'ASC', display_order: 'ASC', created_at: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<FAQ[]> {
    return await this.repository.find({
      where: { category, is_active: true },
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }

  async findById(id: string): Promise<FAQ | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(data: Partial<FAQ>): Promise<FAQ> {
    const faq = this.repository.create(data);
    return await this.repository.save(faq);
  }

  async update(id: string, data: Partial<FAQ>): Promise<FAQ | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAllForAdmin(): Promise<FAQ[]> {
    return await this.repository.find({
      order: { category: 'ASC', display_order: 'ASC', created_at: 'ASC' },
    });
  }

  async getCategories(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder('faq')
      .select('DISTINCT faq.category', 'category')
      .where('faq.is_active = :isActive', { isActive: true })
      .getRawMany();
    
    return result.map(item => item.category);
  }
}