import Fastify from 'fastify';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  total: number;
  createdAt: string;
}

const app = Fastify();

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:30001';

const orders: Order[] = [];

let nextId = 1;

app.get('/orders', async (request, reply) => {
  return orders;
});

app.post<{ Body: { productId: number; quantity: number } }>('/orders', async (request, reply) => {
  const { productId, quantity } = request.body;

  const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${productId}`);

  if (!response.ok) {
    return reply.status(404).send({ error: 'Produto não encontrado no Product Service' });
  }

  const product = await response.json() as Product;

  const order: Order = {
    id: nextId++,
    productId,
    productName: product.name,
    quantity,
    total: product.price * quantity,
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  return reply.status(201).send(order);
});

app.listen({ port: 3002, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Order Service rodando em ${address}`);
});