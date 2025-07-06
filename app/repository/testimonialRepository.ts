import { Repository } from 'typeorm';
import { Testimonial } from '../models/entities/Testimonial';
import { AppDataSource } from '../config/database';

export class TestimonialRepository {
  private repository: Repository<Testimonial>;

  constructor() {
    this.repository = AppDataSource.getRepository(Testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.repository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }

  async findById(id: string): Promise<Testimonial | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const testimonial = this.repository.create(data);
    return await this.repository.save(testimonial);
  }

  async update(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAllForAdmin(): Promise<Testimonial[]> {
    return await this.repository.find({
      order: { display_order: 'ASC', created_at: 'ASC' },
    });
  }
}