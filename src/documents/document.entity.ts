import { DocumentTypeEntity } from 'src/types/type.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
