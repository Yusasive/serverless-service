// index.ts
import { Client } from 'pg';
import { Handler } from 'aws-lambda';

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE = 'postgres',
} = process.env;

// Validate required env variables
['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD'].forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
});

interface ServiceConfig {
  db: string;
  user: string;
  pass: string;
}

const services: ServiceConfig[] = [
  { db: 'litf_db_auth_service',     user: 'litf_auth_user',     pass: DB_PASSWORD! },
  { db: 'litf_db_user_service',     user: 'litf_user_user',     pass: DB_PASSWORD! },
  { db: 'litf_db_payment_service',  user: 'litf_payment_user',  pass: DB_PASSWORD! },
  { db: 'litf_db_helpdesk_service', user: 'litf_helpdesk_user', pass: DB_PASSWORD! },
  { db: 'litf_db_booth_service',    user: 'litf_booth_user',    pass: DB_PASSWORD! },
  { db: 'litf_db_content_service',  user: 'litf_content_user',  pass: DB_PASSWORD! },
];

export const handler: Handler = async () => {
  const client = new Client({
    host: DB_HOST,
    port: parseInt(DB_PORT!, 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    ssl: {
      rejectUnauthorized: false, 
    },
  });

  try {
    await client.connect();

    for (const { db, user, pass } of services) {
      // 1. Create database if not exists
      const dbExists = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists`,
        [db]
      );
      if (!dbExists.rows[0].exists) {
        await client.query(`CREATE DATABASE "${db}"`);
        console.log(`Database "${db}" created.`);
      } else {
        console.log(`Database "${db}" already exists.`);
      }

      // 2. Create user if not exists 
      const userExists = await client.query<{ exists: boolean }>(
        `SELECT EXISTS(SELECT 1 FROM pg_roles WHERE rolname = $1) AS exists`,
        [user]
      );
      if (!userExists.rows[0].exists) {
        const escapedPass = pass.replace(/'/g, "''"); // escape single quotes 
        await client.query(`CREATE USER "${user}" WITH PASSWORD '${escapedPass}'`);
        console.log(`User "${user}" created.`);
      } else {
        console.log(`User "${user}" already exists.`);
      }

      // 3. Grant privileges
      await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${db}" TO "${user}"`);
      console.log(`Granted privileges on "${db}" to "${user}".`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database and user setup complete.' }),
    };
  } catch (error: any) {
    console.error('Error during setup:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    await client.end();
  }
};
