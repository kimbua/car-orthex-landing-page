import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from './cars/cars.module';
import { CompareModule } from './compare/compare.module';
import { TestDriveModule } from './test-drive/test-drive.module';
import { DealersModule } from './dealers/dealers.module';
import { SeedModule } from './seed/seed.module';
import { Car } from './cars/entities/car.entity';
import { Dealer } from './dealers/entities/dealer.entity';
import { TestDriveLead } from './test-drive/entities/test-drive-lead.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'bmw',
        password: process.env.DB_PASSWORD || 'bmw_showroom_dev',
        database: process.env.DB_NAME || 'bmw_showroom',
        entities: [Car, Dealer, TestDriveLead],
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),
    CarsModule,
    CompareModule,
    TestDriveModule,
    DealersModule,
    SeedModule,
  ],
})
export class AppModule {}
