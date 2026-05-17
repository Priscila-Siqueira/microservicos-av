import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';

const app = Fastify( {logger: true} );

//Lendo as URLs do ambiente
const PRODUCTS_SERVICE = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001';
const ORDERS_SERVICE = process.env.ORDERS_SERVICE_URL || 'http://localhost:3002';

//Rota para o serviço de produtos
app.register(httpProxy, {
  upstream: PRODUCTS_SERVICE,
  prefix: '/products', // Todas as requisições para /products serão redirecionadas
  rewritePrefix: 'products', // Remove o prefixo /products antes de enviar para o serviço
});

//Rota para o serviço de pedidos
app.register(httpProxy, {
  upstream: ORDERS_SERVICE,
  prefix: '/orders', // Todas as requisições para /orders serão redirecionadas
  rewritePrefix: 'orders', // Remove o prefixo /orders antes de enviar para o serviço
});

//Rota para o Health Check
app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
}));

//Iniciando o servidor na porta 3000
const start = async () => {
    try {
        await app.listen({port: 3000, host: '0.0.0.0'});
        console.log('API Gateway rodando na porta 3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
