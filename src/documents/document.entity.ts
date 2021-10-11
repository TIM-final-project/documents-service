import { States } from '../enums/states.enum';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false,
  })
  expirationDate: Date;

  @Column({
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state?: States;

  @ManyToOne(() => DocumentTypeEntity, (type) => type.documents)
  type: DocumentTypeEntity;

  @Column({
    nullable: false
  })
  entityId: number;

  @Column({
    nullable: false
  })
  entityType: number;

  @Column({ default: true })
  active?: boolean;

  @Column({ nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  @Column({ nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;
}
