import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ContentController } from "../controllers/ContentController";
import { initializeDb } from "../config/database";

function extractHttpMethod(event: any): string {
  const method =
    event.httpMethod ||
    event.requestContext?.http?.method ||
    event.requestContext?.httpMethod ||
    event.method ||
    "GET";

  return method.toUpperCase();
}

function extractPath(event: any): string {
  let path =
    event.path ||
    event.rawPath ||
    event.requestContext?.http?.path ||
    event.requestContext?.path ||
    event.resource ||
    "";

  if (!path && event.headers) {
    const host = event.headers.host || event.headers.Host;
    if (host) {
      path = "/content";
    }
  }

  return path;
}

function extractPathParameters(path: string): Record<string, string> {
  const pathParams: Record<string, string> = {};

  const cleanPath = path.replace(/^\/content/, "");

  const patterns = [
    { regex: /^\/sections\/([^\/]+)$/, param: "id" },
    { regex: /^\/items\/([^\/]+)$/, param: "id" },
    { regex: /^\/testimonials\/([^\/]+)$/, param: "id" },
    { regex: /^\/faqs\/([^\/]+)$/, param: "id" },
    { regex: /^\/section\/([^\/]+)$/, param: "section_key" },
  ];

  for (const pattern of patterns) {
    const match = cleanPath.match(pattern.regex);
    if (match) {
      pathParams[pattern.param] = match[1];
      break;
    }
  }

  return pathParams;
}

function createStandardEvent(originalEvent: any): APIGatewayProxyEvent {
  const httpMethod = extractHttpMethod(originalEvent);
  const fullPath = extractPath(originalEvent);
  const pathParameters = extractPathParameters(fullPath);

  return {
    ...originalEvent,
    httpMethod,
    path: fullPath,
    pathParameters,
    requestContext: originalEvent.requestContext || {},
    headers: originalEvent.headers || {},
    multiValueHeaders: originalEvent.multiValueHeaders || {},
    queryStringParameters: originalEvent.queryStringParameters || null,
    multiValueQueryStringParameters:
      originalEvent.multiValueQueryStringParameters || null,
    body: originalEvent.body || null,
    isBase64Encoded: originalEvent.isBase64Encoded || false,
    stageVariables: originalEvent.stageVariables || null,
    resource: originalEvent.resource || fullPath,
  } as APIGatewayProxyEvent;
}

export const handler = async (
  originalEvent: any
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Raw incoming event:", JSON.stringify(originalEvent, null, 2));

    const event = createStandardEvent(originalEvent);

    console.log("Processed event:", {
      httpMethod: event.httpMethod,
      path: event.path,
      pathParameters: event.pathParameters,
      headers: Object.keys(event.headers || {}),
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

    await initializeDb();

    const controller = new ContentController();
    const { httpMethod, pathParameters } = event;

    const routePath = (event.path || "").replace(/^\/content/, "") || "";

    console.log("Routing:", { httpMethod, routePath, pathParameters });

    let result: APIGatewayProxyResult;

    // Route matching with detailed logging
    if (httpMethod === "GET" && routePath === "") {
      console.log("Route: Get all content");
      result = await controller.getAllContent(event);
    } else if (httpMethod === "GET" && routePath.startsWith("/section/")) {
      console.log("Route: Get content by section");
      result = await controller.getContentBySection(event);
    } else if (httpMethod === "GET" && routePath === "/admin") {
      console.log("Route: Get admin content");
      result = await controller.getAllContentItemsForAdmin(event);
    }
    // Content Section management
    else if (httpMethod === "POST" && routePath === "/sections") {
      console.log("Route: Create content section");
      result = await controller.createContentSection(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/sections/")) {
      console.log("Route: Update content section");
      result = await controller.updateContentSection(event);
    } else if (httpMethod === "DELETE" && routePath.startsWith("/sections/")) {
      console.log("Route: Delete content section");
      result = await controller.deleteContentSection(event);
    }
    // Content Item management
    else if (httpMethod === "POST" && routePath === "/items") {
      console.log("Route: Create content item");
      result = await controller.createContentItem(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/items/")) {
      console.log("Route: Update content item");
      result = await controller.updateContentItem(event);
    } else if (httpMethod === "DELETE" && routePath.startsWith("/items/")) {
      console.log("Route: Delete content item");
      result = await controller.deleteContentItem(event);
    }
    // Testimonial management
    else if (httpMethod === "POST" && routePath === "/testimonials") {
      console.log("Route: Create testimonial");
      result = await controller.createTestimonial(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/testimonials/")) {
      console.log("Route: Update testimonial");
      result = await controller.updateTestimonial(event);
    } else if (
      httpMethod === "DELETE" &&
      routePath.startsWith("/testimonials/")
    ) {
      console.log("Route: Delete testimonial");
      result = await controller.deleteTestimonial(event);
    }
    // FAQ management
    else if (httpMethod === "POST" && routePath === "/faqs") {
      console.log("Route: Create FAQ");
      result = await controller.createFAQ(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/faqs/")) {
      console.log("Route: Update FAQ");
      result = await controller.updateFAQ(event);
    } else if (httpMethod === "DELETE" && routePath.startsWith("/faqs/")) {
      console.log("Route: Delete FAQ");
      result = await controller.deleteFAQ(event);
    } else {
      console.log("Route: Not found");
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
          debug: {
            method: httpMethod,
            path: routePath,
            availableRoutes: [
              "GET /content",
              "GET /content/section/{section_key}",
              "GET /content/admin",
              "POST /content/sections",
              "PUT /content/sections/{id}",
              "DELETE /content/sections/{id}",
              "POST /content/items",
              "PUT /content/items/{id}",
              "DELETE /content/items/{id}",
              "POST /content/testimonials",
              "PUT /content/testimonials/{id}",
              "DELETE /content/testimonials/{id}",
              "POST /content/faqs",
              "PUT /content/faqs/{id}",
              "DELETE /content/faqs/{id}",
            ],
          },
        }),
      };
    }

    // Ensure CORS headers are always present
    if (result && result.headers) {
      result.headers["Access-Control-Allow-Origin"] = "*";
      result.headers["Access-Control-Allow-Headers"] =
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token";
      result.headers["Access-Control-Allow-Methods"] =
        "GET,POST,PUT,DELETE,OPTIONS";
    }

    console.log("Response:", { statusCode: result.statusCode, success: true });
    return result;
  } catch (error) {
    console.error("Handler error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

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
        debug:
          process.env.NODE_ENV === "development"
            ? {
                stack: error instanceof Error ? error.stack : "No stack trace",
                originalEvent: originalEvent,
              }
            : undefined,
      }),
    };
  }
};
