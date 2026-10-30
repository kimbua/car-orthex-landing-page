import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dealer } from './entities/dealer.entity';

@Injectable()
export class DealersService {
  constructor(
    @InjectRepository(Dealer)
    private readonly dealerRepo: Repository<Dealer>,
  ) {}

  findAll(city?: string): Promise<Dealer[]> {
    const where = city ? { city } : {};
    return this.dealerRepo.find({
      where,
      order: { city: 'ASC', id: 'ASC' },
    });
  }
}
