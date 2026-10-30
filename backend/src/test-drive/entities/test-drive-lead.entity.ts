import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('test_drive_leads')
export class TestDriveLead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', type: 'varchar', length: 120 })
  fullName: string;

  @Column({ name: 'phone', type: 'varchar', length: 30 })
  phone: string;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Index()
  @Column({ name: 'model_slug', type: 'varchar', length: 120 })
  modelSlug: string;

  @Column({ name: 'dealer_id', type: 'int', nullable: true })
  dealerId: number | null;

  @Column({ name: 'preferred_date', type: 'varchar', length: 20, nullable: true })
  preferredDate: string | null;

  @Column({ name: 'preferred_time', type: 'varchar', length: 20, nullable: true })
  preferredTime: string | null;

  @Column({ name: 'message', type: 'text', nullable: true })
  message: string | null;

  @Column({ name: 'status', type: 'varchar', length: 30, default: 'new' })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;
}
