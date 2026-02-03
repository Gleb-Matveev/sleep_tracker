import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Status {
  DONE = 'Done',
  NOTDONE = 'Not done',
}

@Entity('goal')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
