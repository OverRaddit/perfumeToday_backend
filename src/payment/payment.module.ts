import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { paymentProviders } from './payment.provider';
import { DatabaseModule } from 'src/database.module';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [DatabaseModule, UserModule, ProductModule],
  providers: [PaymentService, ...paymentProviders],
  exports: [PaymentService, ...paymentProviders],
  controllers: [PaymentController]
})
export class PaymentModule {}
