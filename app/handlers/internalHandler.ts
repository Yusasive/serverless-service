import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ContentController } from '../controllers/ContentController';
import { AppDataSource } from '../config/database';
import 'reflect-metadata';

let isInitialized = false;

async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected successfully');
      isInitialized = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Handle CORS preflight request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: '',
      };
    }

    await initializeDatabase();
    
    const controller = new ContentController();

    // Internal service endpoints for other microservices
    return await controller.getAllContent(event);
  } catch (error) {
    console.error('Internal handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};