import Fastify from 'fastify';

interface Order {
  id: number;
  productId: number;
  quantity: number;
  createdAt: string;
}

const app = Fastify();

const orders: Order[] = [];

let nextId = 1;

app.get('/orders', async (request, reply) => {
  return orders;
});

app.post<{ Body: { productId: number; quantity: number } }>('/orders', async (request, reply) => {
  const { productId, quantity } = request.body;

  const order: Order = {
    id: nextId++,
    productId,
    quantity,
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