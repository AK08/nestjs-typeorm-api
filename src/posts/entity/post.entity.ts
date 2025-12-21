import { User } from '../../auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  // by defaults its varchar with a limit of 255, type text makes its length unlimited.
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE', // database level feature. This makes sure posts are deleted when user is deleted
  })
  authorName: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
