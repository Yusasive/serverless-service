import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { container } from 'tsyringe';
import { ContentService } from '../services/ContentService';
import { AppResponse } from '../utility/response';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateContentSectionDto, UpdateContentSectionDto } from '../models/dto/ContentSectionDto';
import { CreateContentItemDto, UpdateContentItemDto } from '../models/dto/ContentItemDto';
import { CreateTestimonialDto, UpdateTestimonialDto } from '../models/dto/TestimonialDto';
import { CreateFAQDto, UpdateFAQDto } from '../models/dto/FAQDto';

export class ContentController {
  private contentService: ContentService;

  constructor() {
    this.contentService = container.resolve(ContentService);
  }

  // Public endpoints for client consumption
  async getAllContent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const sections = await this.contentService.getAllContentSections();
      const items = await this.contentService.getAllContentItems();
      const testimonials = await this.contentService.getAllTestimonials();
      const faqs = await this.contentService.getAllFAQs();

      return AppResponse.success({
        sections,
        items,
        testimonials,
        faqs
      });
    } catch (error) {
      return AppResponse.error('Failed to fetch content', error);
    }
  }

  async getContentBySection(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { section_key } = event.pathParameters || {};
      if (!section_key) {
        return AppResponse.badRequest('Section key is required');
      }

      let result;
      switch (section_key) {
        case 'hero':
          result = await this.contentService.getHeroContent();
          break;
        case 'about':
          result = await this.contentService.getAboutContent();
          break;
        case 'features':
          result = await this.contentService.getFeaturesContent();
          break;
        case 'events':
          result = await this.contentService.getEventsContent();
          break;
        case 'testimonials':
          result = { testimonials: await this.contentService.getAllTestimonials() };
          break;
        case 'faqs':
          result = { faqs: await this.contentService.getAllFAQs() };
          break;
        default:
          const section = await this.contentService.getContentSectionByKey(section_key);
          const items = section ? await this.contentService.getContentItemsBySectionId(section.id) : [];
          result = { section, items };
      }

      return AppResponse.success(result);
    } catch (error) {
      return AppResponse.error('Failed to fetch content', error);
    }
  }

  // Admin endpoints for content management
  async getAllContentForAdmin(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const sections = await this.contentService.getAllContentSectionsForAdmin();
      const items = await this.contentService.getAllContentItemsForAdmin();
      const testimonials = await this.contentService.getAllTestimonialsForAdmin();
      const faqs = await this.contentService.getAllFAQsForAdmin();

      return AppResponse.success({
        sections,
        items,
        testimonials,
        faqs
      });
    } catch (error) {
      return AppResponse.error('Failed to fetch content for admin', error);
    }
  }

  // Content Section endpoints
  async createContentSection(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const data = plainToClass(CreateContentSectionDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const section = await this.contentService.createContentSection(data);
      return AppResponse.success(section, 'Content section created successfully');
    } catch (error) {
      return AppResponse.error('Failed to create content section', error);
    }
  }

  async updateContentSection(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Section ID is required');
      }

      const data = plainToClass(UpdateContentSectionDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const section = await this.contentService.updateContentSection(id, data);
      if (!section) {
        return AppResponse.notFound('Content section not found');
      }

      return AppResponse.success(section, 'Content section updated successfully');
    } catch (error) {
      return AppResponse.error('Failed to update content section', error);
    }
  }

  async deleteContentSection(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Section ID is required');
      }

      const deleted = await this.contentService.deleteContentSection(id);
      if (!deleted) {
        return AppResponse.notFound('Content section not found');
      }

      return AppResponse.success(null, 'Content section deleted successfully');
    } catch (error) {
      return AppResponse.error('Failed to delete content section', error);
    }
  }

  // Content Item endpoints
  async createContentItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const data = plainToClass(CreateContentItemDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const item = await this.contentService.createContentItem(data);
      return AppResponse.success(item, 'Content item created successfully');
    } catch (error) {
      return AppResponse.error('Failed to create content item', error);
    }
  }

  async updateContentItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Item ID is required');
      }

      const data = plainToClass(UpdateContentItemDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const item = await this.contentService.updateContentItem(id, data);
      if (!item) {
        return AppResponse.notFound('Content item not found');
      }

      return AppResponse.success(item, 'Content item updated successfully');
    } catch (error) {
      return AppResponse.error('Failed to update content item', error);
    }
  }

  async deleteContentItem(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Item ID is required');
      }

      const deleted = await this.contentService.deleteContentItem(id);
      if (!deleted) {
        return AppResponse.notFound('Content item not found');
      }

      return AppResponse.success(null, 'Content item deleted successfully');
    } catch (error) {
      return AppResponse.error('Failed to delete content item', error);
    }
  }

  // Testimonial endpoints
  async createTestimonial(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const data = plainToClass(CreateTestimonialDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const testimonial = await this.contentService.createTestimonial(data);
      return AppResponse.success(testimonial, 'Testimonial created successfully');
    } catch (error) {
      return AppResponse.error('Failed to create testimonial', error);
    }
  }

  async updateTestimonial(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Testimonial ID is required');
      }

      const data = plainToClass(UpdateTestimonialDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const testimonial = await this.contentService.updateTestimonial(id, data);
      if (!testimonial) {
        return AppResponse.notFound('Testimonial not found');
      }

      return AppResponse.success(testimonial, 'Testimonial updated successfully');
    } catch (error) {
      return AppResponse.error('Failed to update testimonial', error);
    }
  }

  async deleteTestimonial(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('Testimonial ID is required');
      }

      const deleted = await this.contentService.deleteTestimonial(id);
      if (!deleted) {
        return AppResponse.notFound('Testimonial not found');
      }

      return AppResponse.success(null, 'Testimonial deleted successfully');
    } catch (error) {
      return AppResponse.error('Failed to delete testimonial', error);
    }
  }

  // FAQ endpoints
  async createFAQ(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const data = plainToClass(CreateFAQDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const faq = await this.contentService.createFAQ(data);
      return AppResponse.success(faq, 'FAQ created successfully');
    } catch (error) {
      return AppResponse.error('Failed to create FAQ', error);
    }
  }

  async updateFAQ(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('FAQ ID is required');
      }

      const data = plainToClass(UpdateFAQDto, JSON.parse(event.body || '{}'));
      const errors = await validate(data);

      if (errors.length > 0) {
        return AppResponse.badRequest('Validation failed', errors);
      }

      const faq = await this.contentService.updateFAQ(id, data);
      if (!faq) {
        return AppResponse.notFound('FAQ not found');
      }

      return AppResponse.success(faq, 'FAQ updated successfully');
    } catch (error) {
      return AppResponse.error('Failed to update FAQ', error);
    }
  }

  async deleteFAQ(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { id } = event.pathParameters || {};
      if (!id) {
        return AppResponse.badRequest('FAQ ID is required');
      }

      const deleted = await this.contentService.deleteFAQ(id);
      if (!deleted) {
        return AppResponse.notFound('FAQ not found');
      }

      return AppResponse.success(null, 'FAQ deleted successfully');
    } catch (error) {
      return AppResponse.error('Failed to delete FAQ', error);
    }
  }
}