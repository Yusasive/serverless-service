import { CONTENT_BASE_URL } from "@/common/TextStrings";
import axios from "axios";

// Dynamic content service URL based on environment
const getContentServiceUrl = (): string => {
  if (
    import.meta.env.VITE_ENVIRONMENT === "dev" ||
    import.meta.env.VITE_ENVIRONMENT === "prod"
  ) {
    return import.meta.env.VITE_SERVICE_BASE_URL + "/content";
  } else {
    return CONTENT_BASE_URL;
  }
};

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
  content: string | number | readonly string[] | undefined;
  id: string;
  section_id: string;
  title: string;
  description?: string;
  image_url?: string;
  image_base64: any;
  link_url?: string;
  metadata?: any;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  content: string;
  image_url?: string;
  image_base64: any;
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
  private static async request(
    endpoint: string,
    options: any = {}
  ): Promise<any> {
    const baseUrl = getContentServiceUrl();

    try {
      const response = await axios({
        url: `${baseUrl}${endpoint}`,
        timeout: 10000,
        withCredentials: true,
        ...options,
      });
      // console.log("Content API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Content service error:", {
        url: `${baseUrl}${endpoint}`,
        error: error.response?.data || error.message,
        status: error.response?.status,
        config: error.config,
      });

      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please try again.");
      }
      if (error.code === "ECONNREFUSED") {
        throw new Error(
          `Cannot connect to content service at ${baseUrl}. Please check if the service is running.`
        );
      }
      if (error.response?.status === 404) {
        throw new Error("Content endpoint not found.");
      }
      if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Access denied. You do not have permission to perform this action."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Content service unavailable"
      );
    }
  }

  // Content Sections - Load separately for better performance
  static async getAllContentSections(): Promise<ContentSection[]> {
    try {
      const response = await this.request("/sections");
      console.log("Sections API Response:", response);

      // Handle different response structures
      if (response?.data?.sections) {
        return response.data.sections;
      } else if (response?.sections) {
        return response.sections;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch content sections:", error);
      return [];
    }
  }

  static async getAllContentItems(): Promise<ContentItem[]> {
    try {
      const response = await this.request("/items");
      console.log("Items API Response:", response);

      // Handle different response structures
      if (response?.data?.items) {
        return response.data.items;
      } else if (response?.items) {
        return response.items;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch content items:", error);
      return [];
    }
  }

  static async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await this.request("/testimonials");
      console.log("Testimonials API Response:", response);

      // Handle different response structures
      if (response?.data?.testimonials) {
        return response.data.testimonials;
      } else if (response?.testimonials) {
        return response.testimonials;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      return [];
    }
  }

  static async getAllFAQs(): Promise<FAQ[]> {
    try {
      const response = await this.request("/faqs");
      console.log("FAQs API Response:", response);

      // Handle different response structures
      if (response?.data?.faqs) {
        return response.data.faqs;
      } else if (response?.faqs) {
        return response.faqs;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      return [];
    }
  }

  // Keep the combined method for backward compatibility but make it more efficient
  static async getAllContentData(): Promise<{
    sections: ContentSection[];
    items: ContentItem[];
    testimonials: Testimonial[];
    faqs: FAQ[];
  }> {
    try {
      // Load all data in parallel for efficiency when needed
      const [sections, items, testimonials, faqs] = await Promise.all([
        this.getAllContentSections(),
        this.getAllContentItems(),
        this.getAllTestimonials(),
        this.getAllFAQs(),
      ]);

      return { sections, items, testimonials, faqs };
    } catch (error) {
      console.error("Failed to fetch all content data:", error);
      return {
        sections: [],
        items: [],
        testimonials: [],
        faqs: [],
      };
    }
  }

  static async createContentSection(
    data: Partial<ContentSection>
  ): Promise<ContentSection> {
    const response = await this.request("/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async updateContentSection(
    id: string,
    data: Partial<ContentSection>
  ): Promise<ContentSection> {
    const response = await this.request(`/sections/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async deleteContentSection(id: string): Promise<void> {
    await this.request(`/sections/${id}`, {
      method: "DELETE",
    });
  }

  // Content Items
  static async createContentItem(
    data: Partial<ContentItem>
  ): Promise<ContentItem> {
    const response = await this.request("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async updateContentItem(
    id: string,
    data: Partial<ContentItem>
  ): Promise<ContentItem> {
    const response = await this.request(`/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async deleteContentItem(id: string): Promise<void> {
    await this.request(`/items/${id}`, {
      method: "DELETE",
    });
  }

  // Testimonials
  static async createTestimonial(
    data: Partial<Testimonial>
  ): Promise<Testimonial> {
    const response = await this.request("/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async updateTestimonial(
    id: string,
    data: Partial<Testimonial>
  ): Promise<Testimonial> {
    const response = await this.request(`/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async deleteTestimonial(id: string): Promise<void> {
    await this.request(`/testimonials/${id}`, {
      method: "DELETE",
    });
  }

  // FAQs
  static async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    const response = await this.request("/faqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async updateFAQ(id: string, data: Partial<FAQ>): Promise<FAQ> {
    const response = await this.request(`/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    });
    return response;
  }

  static async deleteFAQ(id: string): Promise<void> {
    await this.request(`/faqs/${id}`, {
      method: "DELETE",
    });
  }

  static async getContactPageContent() {
    const response = await this.request("/public/section/contact-page");
    return response.success ? response.data : { section: null, items: [] };
  }

  static async getFooterContent() {
    const response = await this.request("/public/section/footer");
    return response.success ? response.data : { section: null, items: [] };
  }

  // About Page Content
  static async getAboutPageContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await this.request("/public/section/about-page");
    return response.data || { section: null, items: [] };
  }

  // Event Page Content
  static async getEventsContent(): Promise<{
    section: ContentSection | null;
    items: ContentItem[];
  }> {
    const response = await this.request("/public/section/events");
    return response.data || { section: null, items: [] };
  }

  // Media Upload Methods
  static async uploadImage(uploadData: {
    file: string;
    filename: string;
    contentType: string;
    folder?: string;
  }): Promise<{
    url: string;
    key: string;
    filename: string;
    size: number;
    contentType: string;
  }> {
    const response = await this.request("/media/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: uploadData,
    });
    return response.data;
  }

  static async deleteImage(deleteData: {
    url?: string;
    key?: string;
  }): Promise<{ message: string }> {
    const response = await this.request("/media/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(deleteData),
    });
    return response.data;
  }
}
