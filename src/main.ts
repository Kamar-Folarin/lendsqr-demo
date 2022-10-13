import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Will remove extra properties, but not throw an error
    }),
  );
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('DEMO CREDIT  WALLET API server')
    .setDescription('Demo credit wallet API server documentation')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .setExternalDoc('PostmanCollection', '-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
