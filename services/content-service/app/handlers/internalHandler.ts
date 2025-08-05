import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ContentController } from "../controllers/ContentController";
import { initializeDb } from "../config/database";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        body: "",
      };
    }

    await initializeDb();

    const controller = new ContentController();

    // Internal service endpoints for other microservices
    const httpMethod = event.httpMethod;
    const routePath = event.pathParameters?.proxy || "";
    let result: APIGatewayProxyResult;

    if (httpMethod === "GET" && routePath === "") {
      console.log("Route: Get all content for admin");
      const [sections, items, testimonials, faqs] = await Promise.all([
        controller.getAllContentSectionsForAdmin(event),
        controller.getAllContentItemsForAdmin(event),
        controller.getAllTestimonialsForAdmin(event),
        controller.getAllFAQsForAdmin(event),
      ]);

      result = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          data: {
            sections:
              sections.statusCode === 200
                ? JSON.parse(sections.body).data.sections
                : [],
            items:
              items.statusCode === 200 ? JSON.parse(items.body).data.items : [],
            testimonials:
              testimonials.statusCode === 200
                ? JSON.parse(testimonials.body).data.testimonials
                : [],
            faqs:
              faqs.statusCode === 200 ? JSON.parse(faqs.body).data.faqs : [],
          },
        }),
      };
    } else {
      result = await controller.getAllContent(event);
    }

    return result;
  } catch (error) {
    console.error("Internal handler error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
