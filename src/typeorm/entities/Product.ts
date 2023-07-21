import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from './Payment';
import { PaymentDetail } from './PaymentDetail';

@Index('Product_pkey2', ['id'], { unique: true })
@Entity({ name: 'Product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => PaymentDetail, (PaymentDetail) => PaymentDetail.product)
  paymentDetails: PaymentDetail[];
}
