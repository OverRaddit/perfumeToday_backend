import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from './Payment';

@Index('User_pkey2', ['id'], { unique: true })
@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'intraid', length: 50 })
  intraid: string;

  @Column('varchar', { name: 'nickname', nullable: true, length: 100 })
  nickname: string | null;

  @Column('varchar', { name: 'email', length: 50 })
  email: string;

  // @Column('varchar', { name: 'something', length: 50 })
  // something: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
