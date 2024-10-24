import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'decimal' })
  currentPrice!: number | undefined;

  @Column({ nullable: true, type: 'decimal' })
  previousClosePrice!: number | null;

  @CreateDateColumn()
  createdAt!: Date;
}
