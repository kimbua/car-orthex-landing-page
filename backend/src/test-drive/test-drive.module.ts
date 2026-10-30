import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDriveController } from './test-drive.controller';
import { TestDriveService } from './test-drive.service';
import { TestDriveLead } from './entities/test-drive-lead.entity';
import { Car } from '../cars/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestDriveLead, Car])],
  controllers: [TestDriveController],
  providers: [TestDriveService],
})
export class TestDriveModule {}
