import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product';
import { Payment } from './Payment';

@Entity()
export class PaymentDetail {
  // 일반적인 pk 방식
  // @PrimaryGeneratedColumn()
  // id: number;

  // --복합기본키방식--
  @PrimaryColumn()
  paymentId: number;
  @PrimaryColumn()
  productId: number;
  // --------------

  @ManyToOne(() => Payment, (payment) => payment.paymentDetails)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ManyToOne(() => Product, (product) => product.paymentDetails)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'integer' })
  quantity: number;
}
