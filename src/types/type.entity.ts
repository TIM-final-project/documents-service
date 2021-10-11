import { DocumentEntity } from 'src/documents/document.entity';
import { Severities } from 'src/enums/severities.enum';
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

  @Column({ 
    type: 'enum',
    enum: Severities,
    nullable: false
  })
  severity: string;

  @OneToMany(() => DocumentEntity, document => document.type)
  documents: DocumentEntity[]
}
