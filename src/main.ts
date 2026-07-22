import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT
  await app.listen(port || 5001);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
