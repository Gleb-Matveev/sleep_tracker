import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set up Handlebars as the view engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const hbs = require('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('json', (context) => JSON.stringify(context));
  hbs.registerHelper('eq', function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Start the server and log port
  await app.listen(process.env.PORT ?? 3000);
  console.log("Server is listnening on port: ", process.env.PORT)
}
bootstrap();
