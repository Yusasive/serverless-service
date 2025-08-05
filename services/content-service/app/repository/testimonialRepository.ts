import { Repository } from "typeorm";
import { Testimonial } from "../models/entities/Testimonial";
import { dataSource } from "../config/database";

export class TestimonialRepository {
  private repository: Repository<Testimonial>;

  constructor() {
    if (!dataSource) {
      throw new Error("DataSource is not initialized");
    }

    this.repository = dataSource.getRepository(Testimonial);
  }

  async findAll(): Promise<Testimonial[]> {
    return await this.repository.find({
      where: { is_active: true },
      order: { display_order: "ASC", created_at: "ASC" },
    });
  }

  async findById(id: string): Promise<Testimonial | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findOneBy(
    conditions: Partial<Testimonial>
  ): Promise<Testimonial | null> {
    return await this.repository.findOneBy(conditions);
  }

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const testimonial = this.repository.create({
      ...data,
      image_base64: data.image_base64 ?? "",
    });
    return await this.repository.save(testimonial);
  }

  async update(
    id: string,
    data: Partial<Testimonial>
  ): Promise<Testimonial | null> {
    const updatedData: Partial<Testimonial> = {
      ...data,
      image_base64: data.image_base64 ?? "",
    };
    await this.repository.update(id, updatedData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAllForAdmin(): Promise<Testimonial[]> {
    return await this.repository.find({
      order: { display_order: "ASC", created_at: "ASC" },
    });
  }

  async save(testimonial: Testimonial): Promise<Testimonial> {
    return await this.repository.save(testimonial);
  }
}
