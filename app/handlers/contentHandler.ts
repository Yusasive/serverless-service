import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ContentController } from "../controllers/ContentController";
import { AppDataSource } from "../config/database";
import "reflect-metadata";

let isInitialized = false;

async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Database connected successfully");
      isInitialized = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Handle CORS preflight request
    console.log("Incoming request:", {
      path: event.path,
      method: event.httpMethod,
      headers: event.headers,
    });

    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Credentials": "false",
        },
        body: "",
      };
    }

    await initializeDatabase();

    const controller = new ContentController();
    const { httpMethod, pathParameters } = event;
    const requestContext = event.requestContext as unknown as {
      http: { path: string };
    };
    const rawPath =
      typeof event.path === "string"
        ? event.path
        : typeof (requestContext as any)?.http?.path === "string"
          ? (requestContext as any)?.http?.path
          : "";

    const path = rawPath.replace("/content", "");

    let result;
    // Public endpoints

    if (httpMethod === "GET" && path === "") {
      result = await controller.getAllContent(event);
    } else if (httpMethod === "GET" && path.startsWith("/section/")) {
      result = await controller.getContentBySection(event);
    }

    // Admin endpoints
    else if (httpMethod === "GET" && path === "/admin") {
      result = await controller.getAllContentForAdmin(event);
    }

    // Content Section management
    else if (httpMethod === "POST" && path === "/sections") {
      result = await controller.createContentSection(event);
    } else if (httpMethod === "PUT" && path.startsWith("/sections/")) {
      result = await controller.updateContentSection(event);
    } else if (httpMethod === "DELETE" && path.startsWith("/sections/")) {
      result = await controller.deleteContentSection(event);
    }

    // Content Item management
    else if (httpMethod === "POST" && path === "/items") {
      result = await controller.createContentItem(event);
    } else if (httpMethod === "PUT" && path.startsWith("/items/")) {
      result = await controller.updateContentItem(event);
    } else if (httpMethod === "DELETE" && path.startsWith("/items/")) {
      result = await controller.deleteContentItem(event);
    }

    // Testimonial management
    else if (httpMethod === "POST" && path === "/testimonials") {
      result = await controller.createTestimonial(event);
    } else if (httpMethod === "PUT" && path.startsWith("/testimonials/")) {
      result = await controller.updateTestimonial(event);
    } else if (httpMethod === "DELETE" && path.startsWith("/testimonials/")) {
      result = await controller.deleteTestimonial(event);
    }

    // FAQ management
    else if (httpMethod === "POST" && path === "/faqs") {
      result = await controller.createFAQ(event);
    } else if (httpMethod === "PUT" && path.startsWith("/faqs/")) {
      result = await controller.updateFAQ(event);
    } else if (httpMethod === "DELETE" && path.startsWith("/faqs/")) {
      result = await controller.deleteFAQ(event);
    } else {
      result = {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        body: JSON.stringify({
          success: false,
          message: "Endpoint not found",
        }),
      };
    }

    if (result && result.headers) {
      result.headers["Access-Control-Allow-Origin"] = "*";
      result.headers["Access-Control-Allow-Headers"] =
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token";
      result.headers["Access-Control-Allow-Methods"] =
        "GET,POST,PUT,DELETE,OPTIONS";
    }

    return result;
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      },
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
