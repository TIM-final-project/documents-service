import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SeverityEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({nullable: false})
  name?: string;
}