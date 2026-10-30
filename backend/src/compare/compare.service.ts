import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Car } from '../cars/entities/car.entity';

export interface SpecColumn {
  label: string;
  key: string;
  unit: string;
}

export interface ComparisonRow {
  label: string;
  values: Array<string | number | null>;
}

const SPEC_COLUMNS: SpecColumn[] = [
  { label: 'Động cơ', key: 'engine', unit: '' },
  { label: 'Công suất', key: 'powerHp', unit: 'mã lực' },
  { label: 'Mô-men xoắn', key: 'torque', unit: 'Nm' },
  { label: 'Hộp số', key: 'transmission', unit: '' },
  { label: 'Hệ dẫn động', key: 'drivetrain', unit: '' },
  { label: '0–100 km/h', key: 'accel0_100', unit: 's' },
  { label: 'Tốc độ tối đa', key: 'topSpeed', unit: 'km/h' },
  { label: 'Pin', key: 'batteryKwh', unit: 'kWh' },
  { label: 'Phạm vi WLTP', key: 'rangeWltpKm', unit: 'km' },
];

@Injectable()
export class CompareService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  async buildComparison(slugs: string[]) {
    const cars = await this.carRepo.find({
      where: { slug: In(slugs) },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });

    if (cars.length !== slugs.length) {
      const found = new Set(cars.map((c) => c.slug));
      const missing = slugs.filter((s) => !found.has(s));
      throw new NotFoundException(`Car(s) not found: ${missing.join(', ')}`);
    }

    const rows: ComparisonRow[] = SPEC_COLUMNS.map((col) => ({
      label: col.label,
      values: cars.map((car) => {
        const raw = car.specs?.[col.key];
        if (raw === null || raw === undefined || raw === '') return null;
        return col.unit ? `${raw} ${col.unit}` : String(raw);
      }),
    }));

    return {
      columns: SPEC_COLUMNS,
      cars: cars.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        variant: c.variant,
        series: c.series,
        category: c.category,
        fuel: c.fuel,
        isM: c.isM,
        price: c.price,
        priceNote: c.priceNote,
        heroImage: c.heroImage,
        specs: c.specs,
      })),
      rows,
    };
  }
}
