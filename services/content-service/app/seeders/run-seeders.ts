import { AppDataSource } from '../config/typeorm.config';
import { InitialSeeder } from './initial.seeder';

async function runSeeders() {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log('Connected to database.');

        const initialSeeder = new InitialSeeder(AppDataSource);
        await initialSeeder.run();

        console.log('All seeders completed successfully!');
    } catch (error) {
        console.error('Error running seeders:', error);
        throw error;
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

runSeeders().catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
}); 