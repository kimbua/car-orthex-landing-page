import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dealers')
export class Dealer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'city', type: 'varchar', length: 80 })
  city: string;

  @Column({ name: 'address', type: 'varchar', length: 250 })
  address: string;

  @Column({ name: 'phone', type: 'varchar', length: 30 })
  phone: string;

  @Column({ name: 'hours', type: 'varchar', length: 80 })
  hours: string;

  @Column({ name: 'lat', type: 'double precision' })
  lat: number;

  @Column({ name: 'lng', type: 'double precision' })
  lng: number;

  @Column({ name: 'is_service_center', type: 'boolean', default: true })
  isServiceCenter: boolean;
}
