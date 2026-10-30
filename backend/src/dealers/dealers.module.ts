import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealersController } from './dealers.controller';
import { DealersService } from './dealers.service';
import { Dealer } from './entities/dealer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dealer])],
  controllers: [DealersController],
  providers: [DealersService],
  exports: [DealersService],
})
export class DealersModule {}
