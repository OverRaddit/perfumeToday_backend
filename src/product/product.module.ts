import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { productProviders } from './product.provider';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProductService, ...productProviders],
  exports: [ProductService, ...productProviders],
  controllers: [ProductController]
})
export class ProductModule {}
