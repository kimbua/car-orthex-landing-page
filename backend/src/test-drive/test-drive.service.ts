import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestDriveLead } from './entities/test-drive-lead.entity';
import { Car } from '../cars/entities/car.entity';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class TestDriveService {
  constructor(
    @InjectRepository(TestDriveLead)
    private readonly leadRepo: Repository<TestDriveLead>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  modelExists(slug: string): Promise<boolean> {
    return this.carRepo.exist({ where: { slug } });
  }

  createLead(dto: CreateLeadDto): Promise<TestDriveLead> {
    const lead = this.leadRepo.create({
      fullName: dto.fullName.trim(),
      phone: dto.phone.trim(),
      email: dto.email?.trim() || null,
      modelSlug: dto.modelSlug,
      dealerId: dto.dealerId ?? null,
      preferredDate: dto.preferredDate || null,
      preferredTime: dto.preferredTime || null,
      message: dto.message?.trim() || null,
      status: 'new',
    });
    return this.leadRepo.save(lead);
  }
}
