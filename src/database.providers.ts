import { DataSource } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Product } from './typeorm/entities/Product';
import { Payment } from './typeorm/entities/Payment';
import { PaymentDetail } from './typeorm/entities/PaymentDetail';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        name: 'default',
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'perfume_today',
        synchronize: true,
        logging: true,
        //entities: [__dirname + '/**/*.entity{.ts,.js}', User],
        entities: [
          User,
          Product,
          Payment,
          PaymentDetail,
          // Channel,
          // Channelinfo,
          // Friendlist,
          // Matchhistory,
          // Userblacklist,
          // channelBlacklist,
        ],
      });
      return dataSource.initialize();
    },
  },
];
