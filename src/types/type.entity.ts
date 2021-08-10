import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SeverityEntity } from './severity.entity';

@Entity()
export class DocumentTypeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  appliesTo: number;

  @OneToOne(() => SeverityEntity)
  @JoinColumn()
  severity: SeverityEntity;
}
