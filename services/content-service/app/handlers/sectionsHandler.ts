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
  const cleanPath = path.replace(/^\/sections/, "");

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
      "Sections handler - Raw incoming event:",
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

    const routePath = (event.path || "").replace(/^\/sections/, "") || "";

    console.log("Sections routing:", { httpMethod, routePath, pathParameters });

    let result: APIGatewayProxyResult;

    if (httpMethod === "GET" && routePath === "") {
      console.log("Route: Get all sections");
      result = await controller.getAllContentSectionsForAdmin(event);
    } else if (httpMethod === "POST" && routePath === "") {
      console.log("Route: Create content section");
      result = await controller.createContentSection(event);
    } else if (httpMethod === "PUT" && routePath.startsWith("/")) {
      console.log("Route: Update content section");
      result = await controller.updateContentSection(event);
    } else if (httpMethod === "DELETE" && routePath.startsWith("/")) {
      console.log("Route: Delete content section");
      result = await controller.deleteContentSection(event);
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
              "GET /sections",
              "POST /sections",
              "PUT /sections/{id}",
              "DELETE /sections/{id}",
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

    console.log("Sections response:", {
      statusCode: result.statusCode,
      success: true,
    });
    return result;
  } catch (error) {
    console.error("Sections handler error:", error);

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
