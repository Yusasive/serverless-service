import { injectable } from "tsyringe";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface UploadOptions {
  folder?: string;
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

@injectable()
export class MediaService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-east-1",
    });
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || "us-east-1",
    });
    this.bucketName = process.env.S3_UPLOAD_BUCKET_NAME || "litf-dev-media";
  }

  async uploadImage(
    base64Data: string,
    filename: string,
    contentType: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validate inputs
      this.validateUploadInputs(base64Data, filename, contentType);

      // Generate unique filename
      const fileExtension = filename.split(".").pop() || "jpg";
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const uploadFolder = options.folder || "uploads";
      const key = `media/${uploadFolder}/${uniqueFileName}`;

      // Calculate file size
      const fileSize = Math.ceil((base64Data.length * 3) / 4);

      // Upload to S3
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: Buffer.from(base64Data, "base64"),
        ContentType: contentType,
        ServerSideEncryption: "AES256",
        Metadata: {
          "original-filename": filename,
          "upload-timestamp": new Date().toISOString(),
          "file-size": fileSize.toString(),
        },
      };

      const uploadResult = await this.s3.upload(uploadParams).promise();

      // Generate appropriate URL
      const url = this.shouldUseCloudFront()
        ? this.generateSignedUrl(key)
        : uploadResult.Location;

      return {
        url,
        key,
        filename,
        size: fileSize,
        contentType,
      };
    } catch (error) {
      console.error("MediaService upload error:", error);
      throw new Error(
        `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async deleteImage(key: string): Promise<boolean> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();

      return true;
    } catch (error) {
      console.error("MediaService delete error:", error);
      throw new Error(
        `Failed to delete image: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getImageMetadata(key: string): Promise<AWS.S3.HeadObjectOutput> {
    try {
      return await this.s3
        .headObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.error("MediaService metadata error:", error);
      throw new Error(
        `Failed to get image metadata: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private validateUploadInputs(
    base64Data: string,
    filename: string,
    contentType: string
  ): void {
    if (!base64Data || !filename || !contentType) {
      throw new Error(
        "Missing required fields: file, filename, or contentType"
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(contentType)) {
      throw new Error(
        `Invalid file type: ${contentType}. Allowed types: ${allowedTypes.join(", ")}`
      );
    }

    const maxSize = 5 * 1024 * 1024;
    const fileSize = Math.ceil((base64Data.length * 3) / 4);

    if (fileSize > maxSize) {
      throw new Error(
        `File size too large: ${Math.round((fileSize / 1024 / 1024) * 100) / 100}MB. Maximum size is 5MB.`
      );
    }

    if (!this.isValidFilename(filename)) {
      throw new Error(
        "Invalid filename. Only alphanumeric characters, hyphens, underscores, and dots are allowed."
      );
    }

    if (!this.isValidBase64(base64Data)) {
      throw new Error("Invalid base64 file data");
    }
  }

  private shouldUseCloudFront(): boolean {
    return !!(
      process.env.CLOUDFRONT_DOMAIN &&
      process.env.CLOUDFRONT_PRIVATE_KEY &&
      process.env.CLOUDFRONT_KEY_PAIR_ID &&
      process.env.CLOUDFRONT_DOMAIN !== "dev.lagosinternationaltradefair.com"
    );
  }

  private generateSignedUrl(key: string): string {
    const domain = process.env.CLOUDFRONT_DOMAIN!;
    const privateKeyBase64 = process.env.CLOUDFRONT_PRIVATE_KEY!;
    const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID!;

    try {
      const privateKey = Buffer.from(privateKeyBase64, "base64").toString(
        "utf-8"
      );
      const expires = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

      const policy = JSON.stringify({
        Statement: [
          {
            Resource: `https://${domain}/${key}`,
            Condition: {
              DateLessThan: { "AWS:EpochTime": expires },
            },
          },
        ],
      });

      const signer = crypto.createSign("RSA-SHA256");
      signer.update(policy);
      const signature = signer.sign(privateKey, "base64");

      const urlSafe = (str: string) =>
        str.replace(/\+/g, "-").replace(/=/g, "_").replace(/\//g, "~");

      const params = new URLSearchParams({
        "Key-Pair-Id": keyPairId,
        Signature: urlSafe(signature),
        Policy: urlSafe(Buffer.from(policy).toString("base64")),
      });

      return `https://${domain}/${key}?${params.toString()}`;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }
  }

  private isValidBase64(str: string): boolean {
    try {
      const base64Data = str.includes(",") ? str.split(",")[1] : str;
      const decoded = Buffer.from(base64Data, "base64");
      const encoded = decoded.toString("base64");
      return encoded === base64Data;
    } catch {
      return false;
    }
  }

  private isValidFilename(filename: string): boolean {
    const validFilenameRegex = /^[a-zA-Z0-9\-_.\s]+$/;
    return validFilenameRegex.test(filename) && filename.length <= 255;
  }
}
