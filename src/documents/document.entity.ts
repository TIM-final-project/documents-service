import { DocumentTypeEntity } from 'src/types/type.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => DocumentTypeEntity)
  @JoinColumn()
  type: DocumentTypeEntity;
}
