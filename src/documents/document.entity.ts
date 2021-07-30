import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  state: String;
}
