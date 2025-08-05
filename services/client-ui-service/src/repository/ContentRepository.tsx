import axios from "axios";
import { CONTENT_BASE_URL } from "../common/TextStrings";

export interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  metadata?: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  section_id: string;
  title: string;
  description?: string;
  image_url?: string;
  image_base64?: string;
  link_url?: string;
  metadata?: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  content: string;
  image_url?: string;
  image_base64?: string;
  date?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  metadata?: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class ContentRepository {
  private baseUrl: string;
  private static instance: ContentRepository;

  private constructor() {
    if (
      import.meta.env.VITE_ENVIRONMENT === "dev" ||
      import.meta.env.VITE_ENVIRONMENT === "prod"
    ) {
      this.baseUrl = import.meta.env.VITE_SERVICE_BASE_URL;
    } else {
      this.baseUrl = CONTENT_BASE_URL;
    }
  }

  private static getInstance(): ContentRepository {
    if (!ContentRepository.instance) {
      ContentRepository.instance = new ContentRepository();
    }
    return ContentRepository.instance;
  }

  private async request(endpoint: string) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error: any) {
      console.error("Content service error:", error);
      // Return fallback data if service is unavailable
      return { success: false, data: null };
    }
  }

  static async getAllContent(): Promise<{
    sections: ContentSection[];
    items: ContentItem[];
    testimonials: Testimonial[];
    faqs: FAQ[];
  } | null> {
    const response =
      await ContentRepository.getInstance().request("/public/public");
    return response.success ? response.data : null;
  }

  static async getContentBySection(section_key: string): Promise<any> {
    const response = await ContentRepository.getInstance().request(
      `/public/section/${section_key}`
    );
    return response.success ? response.data : null;
  }

  static async getHeroContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/hero"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getAboutContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/about"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getFeaturesContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/features"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getEventsContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/events"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getTestimonials(): Promise<{ testimonials: Testimonial[] }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/testimonials"
    );
    return response.success ? response.data : { testimonials: [] };
  }

  static async getFAQs(): Promise<{ faqs: FAQ[] }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/faqs"
    );
    return response.success ? response.data : { faqs: [] };
  }

  static async getFooterContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/footer"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getAboutPageContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/about-page"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getContactPageContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await ContentRepository.getInstance().request(
      "/public/section/contact-page"
    );
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getFAQsByCategory(category: string): Promise<{ faqs: FAQ[] }> {
    const response = await ContentRepository.getInstance().request(
      `/public/section/faqs?category=${category}`
    );
    return response.success ? response.data : { faqs: [] };
  }
}
