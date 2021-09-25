import { DocumentEntity } from 'src/documents/document.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DocumentTypeEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  appliesTo: number;

  @Column({ nullable: false })
  severity: string;

  @OneToMany(() => DocumentEntity, document => document.type)
  documents: DocumentEntity[]
}
