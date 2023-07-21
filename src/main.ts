import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import * as serveStatic from 'serve-static';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

async function bootstrap() {
  config();
  // 2개가 무슨 차이인지 잘 모르겠다.
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
	const configService = new ConfigService();
  app.use(cookieParser());
  //app.useGlobalFilters(new SocketParameterValidationExceptionFilter());
  app.enableCors({
    // origin: 'http://localhost:3001',
    origin: '*',
    // origin: `${configService.get<string>('FRONTEND_URL')}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Handlebars(Template Engine)을 위한 설정
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
