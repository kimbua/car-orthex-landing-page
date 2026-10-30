import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'slug', type: 'varchar', length: 120 })
  slug: string;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'model_line', type: 'varchar', length: 60 })
  modelLine: string;

  @Column({ name: 'variant', type: 'varchar', length: 80 })
  variant: string;

  @Column({ name: 'badge', type: 'varchar', length: 60, default: '' })
  badge: string;

  @Column({ name: 'series', type: 'varchar', length: 20 })
  series: string;

  @Column({ name: 'category', type: 'varchar', length: 40 })
  category: string;

  @Column({ name: 'fuel', type: 'varchar', length: 20 })
  fuel: string;

  @Column({ name: 'is_m', type: 'boolean', default: false })
  isM: boolean;

  @Column({ name: 'year', type: 'int' })
  year: number;

  @Column({ name: 'price', type: 'bigint', nullable: true })
  price: number | null;

  @Column({ name: 'price_note', type: 'varchar', length: 200, nullable: true })
  priceNote: string | null;

  @Column({ name: 'short_desc', type: 'text' })
  shortDesc: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'hero_image', type: 'varchar', length: 300 })
  heroImage: string;

  @Column({ name: 'gallery_exterior', type: 'jsonb' })
  galleryExterior: string[];

  @Column({ name: 'gallery_interior', type: 'jsonb' })
  galleryInterior: string[];

  @Column({ name: 'specs', type: 'jsonb' })
  specs: Record<string, unknown>;

  @Column({ name: 'source_url', type: 'varchar', length: 300 })
  sourceUrl: string;

  @Column({ name: 'source_name', type: 'varchar', length: 120 })
  sourceName: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
