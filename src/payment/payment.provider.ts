import { Payment } from 'src/typeorm/entities/Payment';
import { PaymentDetail } from 'src/typeorm/entities/PaymentDetail';
import { DataSource } from 'typeorm';

export const paymentProviders = [
  {
    provide: 'PAYMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: ['DATA_SOURCE'],
  },
  // 이렇게 한곳에 모아서 정의하는게 올바른 방식인지 헷갈린다.
  {
    provide: 'PAYMENTDETAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PaymentDetail),
    inject: ['DATA_SOURCE'],
  },
];
