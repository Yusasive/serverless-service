import { ContentSeeder } from './initial.seeder';

async function runSeeders() {
  try {
    console.log('Running content seeders...');
    await ContentSeeder.run();
    console.log('All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
}

runSeeders();