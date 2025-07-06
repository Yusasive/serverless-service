import { injectable } from 'tsyringe';
import { ContentSectionRepository } from '../repository/contentSectionRepository';
import { ContentItemRepository } from '../repository/contentItemRepository';
import { TestimonialRepository } from '../repository/testimonialRepository';
import { FAQRepository } from '../repository/faqRepository';
import { CreateContentSectionDto, UpdateContentSectionDto } from '../models/dto/ContentSectionDto';
import { CreateContentItemDto, UpdateContentItemDto } from '../models/dto/ContentItemDto';
import { CreateTestimonialDto, UpdateTestimonialDto } from '../models/dto/TestimonialDto';
import { CreateFAQDto, UpdateFAQDto } from '../models/dto/FAQDto';

@injectable()
export class ContentService {
  private contentSectionRepo: ContentSectionRepository;
  private contentItemRepo: ContentItemRepository;
  private testimonialRepo: TestimonialRepository;
  private faqRepo: FAQRepository;

  constructor() {
    this.contentSectionRepo = new ContentSectionRepository();
    this.contentItemRepo = new ContentItemRepository();
    this.testimonialRepo = new TestimonialRepository();
    this.faqRepo = new FAQRepository();
  }

  // Content Sections
  async getAllContentSections() {
    return await this.contentSectionRepo.findAll();
  }

  async getContentSectionByKey(section_key: string) {
    return await this.contentSectionRepo.findByKey(section_key);
  }

  async getContentSectionById(id: string) {
    return await this.contentSectionRepo.findById(id);
  }

  async createContentSection(data: CreateContentSectionDto) {
    return await this.contentSectionRepo.create(data);
  }

  async updateContentSection(id: string, data: UpdateContentSectionDto) {
    return await this.contentSectionRepo.update(id, data);
  }

  async deleteContentSection(id: string) {
    return await this.contentSectionRepo.delete(id);
  }

  async getAllContentSectionsForAdmin() {
    return await this.contentSectionRepo.findAllForAdmin();
  }

  // Content Items
  async getAllContentItems() {
    return await this.contentItemRepo.findAll();
  }

  async getContentItemsBySectionId(section_id: string) {
    return await this.contentItemRepo.findBySectionId(section_id);
  }

  async getContentItemById(id: string) {
    return await this.contentItemRepo.findById(id);
  }

  async createContentItem(data: CreateContentItemDto) {
    return await this.contentItemRepo.create(data);
  }

  async updateContentItem(id: string, data: UpdateContentItemDto) {
    return await this.contentItemRepo.update(id, data);
  }

  async deleteContentItem(id: string) {
    return await this.contentItemRepo.delete(id);
  }

  async getAllContentItemsForAdmin() {
    return await this.contentItemRepo.findAllForAdmin();
  }

  // Testimonials
  async getAllTestimonials() {
    return await this.testimonialRepo.findAll();
  }

  async getTestimonialById(id: string) {
    return await this.testimonialRepo.findById(id);
  }

  async createTestimonial(data: CreateTestimonialDto) {
    return await this.testimonialRepo.create(data);
  }

  async updateTestimonial(id: string, data: UpdateTestimonialDto) {
    return await this.testimonialRepo.update(id, data);
  }

  async deleteTestimonial(id: string) {
    return await this.testimonialRepo.delete(id);
  }

  async getAllTestimonialsForAdmin() {
    return await this.testimonialRepo.findAllForAdmin();
  }

  // FAQs
  async getAllFAQs() {
    return await this.faqRepo.findAll();
  }

  async getFAQsByCategory(category: string) {
    return await this.faqRepo.findByCategory(category);
  }

  async getFAQById(id: string) {
    return await this.faqRepo.findById(id);
  }

  async createFAQ(data: CreateFAQDto) {
    return await this.faqRepo.create(data);
  }

  async updateFAQ(id: string, data: UpdateFAQDto) {
    return await this.faqRepo.update(id, data);
  }

  async deleteFAQ(id: string) {
    return await this.faqRepo.delete(id);
  }

  async getAllFAQsForAdmin() {
    return await this.faqRepo.findAllForAdmin();
  }

  async getFAQCategories() {
    return await this.faqRepo.getCategories();
  }

  // Combined data for specific sections
  async getHeroContent() {
    const heroSection = await this.contentSectionRepo.findByKey('hero');
    const heroItems = heroSection ? await this.contentItemRepo.findBySectionId(heroSection.id) : [];
    
    return {
      section: heroSection,
      items: heroItems
    };
  }

  async getAboutContent() {
    const aboutSection = await this.contentSectionRepo.findByKey('about');
    const aboutItems = aboutSection ? await this.contentItemRepo.findBySectionId(aboutSection.id) : [];
    
    return {
      section: aboutSection,
      items: aboutItems
    };
  }

  async getFeaturesContent() {
    const featuresSection = await this.contentSectionRepo.findByKey('features');
    const featuresItems = featuresSection ? await this.contentItemRepo.findBySectionId(featuresSection.id) : [];
    
    return {
      section: featuresSection,
      items: featuresItems
    };
  }

  async getEventsContent() {
    const eventsSection = await this.contentSectionRepo.findByKey('events');
    const eventsItems = eventsSection ? await this.contentItemRepo.findBySectionId(eventsSection.id) : [];
    
    return {
      section: eventsSection,
      items: eventsItems
    };
  }
}