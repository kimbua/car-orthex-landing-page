import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';
import { Dealer } from '../dealers/entities/dealer.entity';
import { CARS, DEALERS } from './data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    @InjectRepository(Dealer)
    private readonly dealerRepo: Repository<Dealer>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.SEED_ON_STARTUP !== 'true') {
      this.logger.log('SEED_ON_STARTUP != true — skip seeding');
      return;
    }

    const carCount = await this.carRepo.count();
    if (carCount === 0) {
      await this.carRepo.save(
        this.carRepo.create(CARS.map((c) => ({ ...c, price: c.price ?? null }))),
        { chunk: 50 },
      );
      this.logger.log(`Seeded ${CARS.length} BMW models`);
    } else {
      this.logger.log(`Cars table already has ${carCount} rows — skip car seed`);
    }

    const dealerCount = await this.dealerRepo.count();
    if (dealerCount === 0) {
      await this.dealerRepo.save(this.dealerRepo.create(DEALERS), { chunk: 50 });
      this.logger.log(`Seeded ${DEALERS.length} BMW dealers`);
    } else {
      this.logger.log(`Dealers table already has ${dealerCount} rows — skip dealer seed`);
    }
  }
}
