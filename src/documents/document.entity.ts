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
    nullable: false,
    default: 0
  })
  state: number;

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
