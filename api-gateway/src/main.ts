import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para permitir requisições do frontend
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Proxy para o auth-service (porta 3002) sem remover o prefixo da rota
  const authProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
  });

  app.use((req: any, res: any, next: any) => {
    const targetPaths = ['/auth', '/users', '/institutes'];
    const matches = targetPaths.some(path => req.url.startsWith(path));
    
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
