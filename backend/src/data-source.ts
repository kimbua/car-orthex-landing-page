import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Car } from './cars/entities/car.entity';
import { Dealer } from './dealers/entities/dealer.entity';
import { TestDriveLead } from './test-drive/entities/test-drive-lead.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'bmw',
  password: process.env.DB_PASSWORD || 'bmw_showroom_dev',
  database: process.env.DB_NAME || 'bmw_showroom',
  entities: [Car, Dealer, TestDriveLead],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  logging: false,
});
