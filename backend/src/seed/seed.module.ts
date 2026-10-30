import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Car } from '../cars/entities/car.entity';
import { Dealer } from '../dealers/entities/dealer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Dealer])],
  providers: [SeedService],
})
export class SeedModule {}
