import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // CORS
  const corsWhitelist =
    configService.get<string>('ENABLE_CORS')?.split(',') || [];
  if (corsWhitelist.length > 0) {
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || corsWhitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });
  }

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('InsureTech API')
    .setDescription('API documentation for the InsureTech backend service.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication and authorization')
    .addTag('Users', 'User management')
    .addTag('Dashboard', 'Dashboard KPI metrics')
    .addTag('Complexes', 'Complex management')
    .addTag('Policies', 'Policy management')
    .addTag('Claims', 'Claim management')
    .addTag('Documents', 'Document management')
    .addTag('Approvals', 'Approval management')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-doc', app, document);

  const port = configService.get<number>('PORT', 8080);
  await app.listen(port);
}
bootstrap();
