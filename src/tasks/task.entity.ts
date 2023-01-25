import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { taskStatus } from './task.module';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  Description: string;

  @Column()
  Status: taskStatus;
}
