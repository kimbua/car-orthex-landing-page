import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompareController } from './compare.controller';
import { CompareService } from './compare.service';
import { Car } from '../cars/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CompareController],
  providers: [CompareService],
})
export class CompareModule {}
