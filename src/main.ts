import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Only using this way due to NestJS compatibility

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
