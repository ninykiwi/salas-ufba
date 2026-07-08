import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS restrito às origens permitidas
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Proxy para o auth-service sem remover o prefixo da rota
  const authProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
  });

  app.use((req: any, res: any, next: any) => {
    const targetPaths = ['/auth', '/users', '/institutes'];
    const matches = targetPaths.some((path) => req.url.startsWith(path));

    if (matches) {
      return authProxy(req, res, next);
    }
    next();
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API Gateway rodando em: http://localhost:${port}`);
}
bootstrap();
