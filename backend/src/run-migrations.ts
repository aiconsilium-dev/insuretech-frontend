import AppDataSource from './data-source';
import { InitialDatabaseSetup1700000000000 } from './migrations/1700000000000-InitialDatabaseSetup';
import { CreateViews1700000000001 } from './migrations/1700000000001-CreateViews';

const runMigrations = async () => {
  try {
    console.log('Initializing Data Source...');
    AppDataSource.setOptions({
        migrations: [InitialDatabaseSetup1700000000000, CreateViews1700000000001]
    });
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    console.log('Running migrations...');
    await AppDataSource.runMigrations();
    console.log('Migrations have been run successfully.');

    await AppDataSource.destroy();
    console.log('Data Source has been destroyed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during migration run:', err);
    process.exit(1);
  }
};

runMigrations();
