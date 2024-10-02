import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEVELOPMENT, PRODUCTION, STAGE } from './config/constants/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const environment = configService.get<string | undefined>('NODE_ENV');
  const port: number =
    environment === DEVELOPMENT
      ? configService.get<number>('APP_PORT_DEV')
      : environment === STAGE
        ? configService.get<number>('APP_PORT_STAGE')
        : environment === PRODUCTION
          ? configService.get<number>('APP_PORT_PROD')
          : 5000;

  await app.listen(port);
}
bootstrap();
