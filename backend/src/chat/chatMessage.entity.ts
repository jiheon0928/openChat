import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatMessages, { onDelete: 'CASCADE' })
  sender: User;
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
