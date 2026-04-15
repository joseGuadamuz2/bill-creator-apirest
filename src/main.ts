import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Bill Creator API')
    .setDescription('API REST para gestión de clientes y facturas')
    .setVersion('1.0')
    .addBearerAuth(          // 👈 habilita el botón "Authorize" con JWT
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido en POST /auth/login',
      },
      'access-token',        // nombre del esquema (debe coincidir con @ApiBearerAuth())
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Servidor corriendo en: http://localhost:3000`);
  console.log(`Swagger disponible en: http://localhost:3000/api/docs`);
}
bootstrap();