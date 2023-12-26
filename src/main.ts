import { NestFactory } from '@nestjs/core';
import { QueueModule } from './queue/queue.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(QueueModule);
  setupApp(app);
  await app.listen(3000);
}
bootstrap();
