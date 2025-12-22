import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

enum Status {
  DONE = "Done",
  NOTDONE = "Not done"
}

@Entity('goal')
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @ManyToOne(() => User, user => user.goals)
  user: User;
}