import "reflect-metadata";
import { dataSource, initializeDb } from "./database";

const queries = [
    "INSERT INTO migrations (timestamp, name) VALUES (1749095438112, 'InitialMigration1749095438112')"
]

export const handler = async () => {
    try {
        // Initialize database connection
        await initializeDb();
        
        if (!dataSource || !dataSource.isInitialized) {
            throw new Error("Database connection not initialized");
        }

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        
        try {
            // Run the specific migration query
            for (const query of queries) {
                const result = await queryRunner.query(query);
                console.log('Migration query executed successfully:', result);
            }
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Migration record inserted successfully',
                    data: queries.length
                })
            };
        } finally {
            await queryRunner.release();
        }
    } catch (error) {
        console.error('Error running migration query:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            })
        };
    }
};