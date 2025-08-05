import { ContentRepository } from "../repository/ContentRepository";

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  filename?: string;
  size?: number;
  contentType?: string;
  error?: string;
}

export class S3UploadService {
  private static instance: S3UploadService;

  /**
   * Singleton instance getter
   */
  static getInstance(): S3UploadService {
    if (!S3UploadService.instance) {
      S3UploadService.instance = new S3UploadService();
    }
    return S3UploadService.instance;
  }

  /**
   * Upload image using the existing content-service media endpoint
   */
  async uploadImage(
    file: File,
    folder: string = "uploads"
  ): Promise<UploadResult> {
    try {
      const base64Data = await this.fileToBase64(file);

      const result = await ContentRepository.uploadImage({
        file: base64Data,
        filename: file.name,
        contentType: file.type,
        folder: folder,
      });

      return {
        success: true,
        url: result.url,
        key: result.key,
        filename: result.filename,
        size: result.size,
        contentType: result.contentType,
      };
    } catch (error) {
      console.error("S3UploadService upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete image using the existing content-service media endpoint
   */
  async deleteImage(url: string, key?: string): Promise<boolean> {
    try {
      await ContentRepository.deleteImage({ url, key });
      return true;
    } catch (error) {
      console.error("S3UploadService delete error:", error);
      throw new Error(
        `Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Convert File to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Validate image file before upload
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`,
      };
    }

    return { isValid: true };
  }
}
