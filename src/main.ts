import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const hbs = require('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  await app.listen(process.env.PORT ?? 3000);
  console.log("Server is listnening on port: ", process.env.PORT)
}
bootstrap();
