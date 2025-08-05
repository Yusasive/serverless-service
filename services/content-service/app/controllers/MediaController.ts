import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AppResponse } from "../utility/response";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";

export class MediaController {
  async uploadImage(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      console.log("Upload request received");

      const body =
        typeof event.body === "string"
          ? JSON.parse(event.body || "{}")
          : event.body;

      const { file: base64Data, filename, contentType, folder } = body;

      if (!base64Data || !filename || !contentType) {
        console.log("Missing required fields for upload");
        return AppResponse.badRequest(
          "Missing required fields: file, filename, or contentType"
        );
      }

      // Validate base64 format
      if (!this.isValidBase64(base64Data)) {
        return AppResponse.badRequest("Invalid base64 file data");
      }

      console.log("File info:", {
        filename,
        contentType,
        folder: folder || "uploads",
        dataLength: base64Data.substring(0, 100) + "...",
      });

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(contentType)) {
        console.log("Invalid file type:", contentType);
        return AppResponse.badRequest(
          `Invalid file type: ${contentType}. Allowed types: ${allowedTypes.join(", ")}`
        );
      }

      const maxSize = 5 * 1024 * 1024;
      const fileSize = Math.ceil((base64Data.length * 3) / 4);
      if (fileSize > maxSize) {
        console.log("File too large:", fileSize);
        return AppResponse.badRequest(
          `File size too large: ${Math.round((fileSize / 1024 / 1024) * 100) / 100}MB. Maximum size is 5MB.`
        );
      }

      if (!this.isValidFilename(filename)) {
        return AppResponse.badRequest(
          "Invalid filename. Only alphanumeric characters, hyphens, underscores, and dots are allowed."
        );
      }

      const fileExtension = filename.split(".").pop() || "jpg";
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const uploadFolder = folder || "uploads";
      const key = `media/${uploadFolder}/${uniqueFileName}`;

      const bucketName = process.env.S3_UPLOAD_BUCKET_NAME || "litf-dev-media";
      if (!process.env.AWS_REGION) {
        console.warn("AWS_REGION not set, using default region");
      }

      const s3 = new AWS.S3();

      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(base64Data, "base64"),
        ContentType: contentType,
        ServerSideEncryption: "AES256",
        Metadata: {
          "original-filename": filename,
          "upload-timestamp": new Date().toISOString(),
        },
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      const imageUrl = uploadResult.Location;

      if (!process.env.CLOUDFRONT_DOMAIN) {
        console.log("CloudFront domain not configured, using S3 URL");
        return AppResponse.success(
          {
            url: imageUrl,
            key: key,
            filename: filename,
            size: fileSize,
            contentType: contentType,
          },
          "Image uploaded successfully"
        );
      }

      const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
      const signedUrl = this.generateSignedUrl(cloudFrontDomain, key);

      console.log("Upload successful:", signedUrl);

      return AppResponse.success(
        {
          url: signedUrl,
          key: key,
          filename: filename,
          size: fileSize,
          contentType: contentType,
        },
        "Image uploaded successfully"
      );
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        if (error.message.includes("NoSuchBucket")) {
          return AppResponse.error(
            "S3 bucket not found. Please check configuration."
          );
        }
        if (error.message.includes("AccessDenied")) {
          return AppResponse.error(
            "Access denied to S3 bucket. Please check IAM permissions."
          );
        }
      }
      return AppResponse.error(
        "Failed to upload image. Please try again.",
        error
      );
    }
  }

  async deleteImage(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    try {
      const body =
        typeof event.body === "string"
          ? JSON.parse(event.body || "{}")
          : event.body;
      const { url, key } = body;

      if (!url && !key) {
        return AppResponse.badRequest("Image URL or key is required");
      }

      let s3Key = key;

      if (!s3Key && url) {
        if (url.includes("cloudfront.net") || url.includes("amazonaws.com")) {
          const urlParts = url.split("/");
          const mediaIndex = urlParts.findIndex(
            (part: string) => part === "media"
          );
          if (mediaIndex !== -1) {
            s3Key = urlParts.slice(mediaIndex).join("/").split("?")[0];
          }
        }
      }

      if (!s3Key) {
        return AppResponse.badRequest("Could not extract key from URL");
      }

      const s3 = new AWS.S3();
      const bucketName = process.env.S3_UPLOAD_BUCKET_NAME || "litf-dev-media";

      await s3
        .deleteObject({
          Bucket: bucketName,
          Key: s3Key,
        })
        .promise();

      return AppResponse.success({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      return AppResponse.error("Failed to delete image", error);
    }
  }

  private generateSignedUrl(domain: string, key: string): string {
    const privateKeyBase64 = process.env.CLOUDFRONT_PRIVATE_KEY || "";
    const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID || "";
    const bucketName = process.env.S3_UPLOAD_BUCKET_NAME || "litf-dev-media";

    if (
      !domain ||
      domain === "your-cloudfront-domain.cloudfront.net" ||
      !privateKeyBase64 ||
      !keyPairId
    ) {
      console.log("CloudFront not fully configured, using S3 URL as fallback");
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    }

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
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    }
  }

  //  ADDED: Validate base64 string
  private isValidBase64(str: string): boolean {
    if (typeof str !== "string") return false;
    const cleaned = str.split(",").pop() || "";
    const base64Regex =
      /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i;
    return base64Regex.test(cleaned);
  }

  // ADDED: Validate safe filename
  private isValidFilename(name: string): boolean {
    const filenameRegex = /^[a-zA-Z0-9._-]+$/;
    return filenameRegex.test(name);
  }
}
