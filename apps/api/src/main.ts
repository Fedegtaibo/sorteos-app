import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Necesario para validar firma del webhook de MP
    logger: ['error', 'warn', 'log'],
  });

  // CORS — solo el frontend propio
  const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://192.168.0.12:3000',
];

app.enableCors({
  origin: allowedOrigins,
  credentials: true,
});
  // Prefijo global de la API
  app.setGlobalPrefix('v1');

  // Validacion automatica de DTOs con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,        // Convierte tipos automaticamente (string -> number, etc.)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger — documentacion interactiva en /api/docs
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sorteos Platform API')
      .setDescription('API para la plataforma de sorteos verificados')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\nSorteos API corriendo en: http://localhost:${port}`);
  console.log(`Documentacion Swagger: http://localhost:${port}/api/docs\n`);
}

bootstrap();
