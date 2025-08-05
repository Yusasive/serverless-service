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

  return path;
}

function extractPathParameters(path: string): Record<string, string> {
  const pathParams: Record<string, string> = {};
  const cleanPath = path.replace(/^\/testimonials/, "");

  const patterns = [{ regex: /^\/([^\/]+)$/, param: "id" }];

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
    console.log(
      "Testimonials handler - Raw incoming event:",
      JSON.stringify(originalEvent, null, 2)
    );

    const event = createStandardEvent(originalEvent);

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

    const routePath = (event.path || "").replace(/^\/testimonials/, "") || "";

    console.log("Testimonials routing:", {
      httpMethod,
      routePath,
      pathParameters,
    });

    let result: APIGatewayProxyResult;

    if (httpMethod === "GET" && routePath === "") {
      console.log("Route: Get all testimonials");
      result = await controller.getAllTestimonialsForAdmin(event);
    } else if (httpMethod === "POST" && routePath === "") {
      console.log("Route: Create testimonial");
      result = await controller.createTestimonial(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/")) {
      console.log("Route: Update testimonial");
      result = await controller.updateTestimonial(event);
    } else if (httpMethod === "DELETE" && routePath.startsWith("/")) {
      console.log("Route: Delete testimonial");
      result = await controller.deleteTestimonial(event);
    } else {
      result = {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: false,
          message: "Endpoint not found",
          debug: {
            method: httpMethod,
            path: routePath,
            availableRoutes: [
              "GET /testimonials",
              "POST /testimonials",
              "PUT /testimonials/{id}",
              "DELETE /testimonials/{id}",
            ],
          },
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

    console.log("Testimonials response:", {
      statusCode: result.statusCode,
      success: true,
    });
    return result;
  } catch (error) {
    console.error("Testimonials handler error:", error);

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
