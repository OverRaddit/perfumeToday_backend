import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { PaymentDetail } from './PaymentDetail';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({ type: 'integer', default: 0 })
  totalAmount: number;

  // 0 미결제
  // 1 결제완료(신규주문)
  // 2 배송준비(발주처리됨)
  // 3 배송중
  // 4 배송완료
  @Column({ type: 'integer', default: 0 })
  status: number;

	@CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PaymentDetail, (PaymentDetail) => PaymentDetail.product)
  paymentDetails: PaymentDetail[];
}
