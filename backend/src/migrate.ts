import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * Programmatic migration runner used by the production container.
 * Uses compiled entities/migrations from dist/ so no ts-node is needed at runtime.
 */
async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'bmw',
    password: process.env.DB_PASSWORD || 'bmw_showroom_dev',
    database: process.env.DB_NAME || 'bmw_showroom',
    entities: [
      __dirname + '/cars/entities/*.js',
      __dirname + '/dealers/entities/*.js',
      __dirname + '/test-drive/entities/*.js',
    ],
    migrations: [__dirname + '/migration/*.js'],
    synchronize: false,
    logging: false,
  });

  await ds.initialize();
  const executed = await ds.runMigrations();
  // eslint-disable-next-line no-console
  console.log(`[migrate] applied ${executed.length} migration(s)`);
  await ds.destroy();
}

run().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
