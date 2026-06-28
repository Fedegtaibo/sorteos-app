import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Necesario para validar firma del webhook de MP
    logger: ['error', 'warn', 'log'],
  });

    // CORS — abierto en desarrollo, restringido al frontend oficial en producción
  const isProduction = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL;

  app.enableCors({
    origin: isProduction
      ? (origin, callback) => {
          if (!origin || origin === frontendUrl) {
            return callback(null, true);
          }

          return callback(new Error(`Origen no permitido por CORS: ${origin}`), false);
        }
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
