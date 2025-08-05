import "reflect-metadata";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MediaController } from "../controllers/MediaController";

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
      path = "/media";
    }
  }

  return path;
}

function createStandardEvent(originalEvent: any): APIGatewayProxyEvent {
  const httpMethod = extractHttpMethod(originalEvent);
  const fullPath = extractPath(originalEvent);

  return {
    ...originalEvent,
    httpMethod,
    path: fullPath,
    pathParameters: originalEvent.pathParameters || {},
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
    console.log("Raw media event:", JSON.stringify(originalEvent, null, 2));

    const event = createStandardEvent(originalEvent);

    console.log("Processed media event:", {
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

    const controller = new MediaController();
    const { httpMethod } = event;

    const routePath = (event.path || "").replace(/^\/media/, "") || "";

    console.log("Media routing:", { httpMethod, routePath });

    let result: APIGatewayProxyResult;

    if (httpMethod === "POST" && routePath === "/upload") {
      console.log("Route: Upload image");
      result = await controller.uploadImage(event);
    } else if (httpMethod === "DELETE" && routePath === "/delete") {
      console.log("Route: Delete image");
      result = await controller.deleteImage(event);
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
            availableRoutes: ["POST /media/upload", "DELETE /media/delete"],
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

    console.log("Media response:", {
      statusCode: result.statusCode,
      success: true,
    });
    return result;
  } catch (error) {
    console.error("Media handler error:", error);
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
