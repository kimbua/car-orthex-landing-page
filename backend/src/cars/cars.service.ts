import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Car } from './entities/car.entity';

export interface CarsQuery {
  fuel?: string;
  category?: string;
  isM?: boolean;
  series?: string;
}

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  findAll(query: CarsQuery = {}): Promise<Car[]> {
    const where: FindOptionsWhere<Car> = {};
    if (query.fuel) where.fuel = query.fuel;
    if (query.category) where.category = query.category;
    if (query.isM !== undefined) where.isM = query.isM;
    if (query.series) where.series = query.series;
    return this.carRepo.find({
      where,
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  findBySlug(slug: string): Promise<Car | null> {
    return this.carRepo.findOne({ where: { slug } });
  }

  findBySlugs(slugs: string[]): Promise<Car[]> {
    return this.carRepo.find({
      where: { slug: In(slugs) },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async existsSlug(slug: string): Promise<boolean> {
    return (await this.carRepo.count({ where: { slug } })) > 0;
  }
}
