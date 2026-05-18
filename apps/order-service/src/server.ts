// Importa o framework Fastify para criar a API
import Fastify from 'fastify';

// Interface que define a estrutura de um produto
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// Interface que define a estrutura de um pedido
interface Order {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  total: number;
  createdAt: string;
}

// Cria a aplicação Fastify
const app = Fastify();

// URL do microsserviço de produtos
// Se existir uma variável de ambiente, ela será usada.
// Caso contrário, usa localhost:30001
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:30001';

// Array que armazena os pedidos em memória
const orders: Order[] = [];

// Variável para gerar IDs automáticos dos pedidos
let nextId = 1;

// ======================
// ROTA GET /orders
// ======================
// Retorna todos os pedidos cadastrados
app.get('/orders', async (request, reply) => {
  return orders;
});

// ======================
// ROTA POST /orders
// ======================
// Cria um novo pedido
app.post<{ Body: { productId: number; quantity: number } }>(
  '/orders',
  async (request, reply) => {

    // Pega os dados enviados no corpo da requisição
    const { productId, quantity } = request.body;

    // Faz uma requisição para o Product Service
    // buscando o produto pelo ID
    const response = await fetch(
      `${PRODUCT_SERVICE_URL}/products/${productId}`
    );

    // Se o produto não existir,
    // retorna erro 404
    if (!response.ok) {
      return reply.status(404).send({
        error: 'Produto não encontrado no Product Service'
      });
    }

    // Converte a resposta da API para objeto Product
    const product = await response.json() as Product;

    // Cria o objeto do pedido
    const order: Order = {
      // ID automático
      id: nextId++,

      // ID do produto comprado
      productId,

      // Nome do produto
      productName: product.name,

      // Quantidade comprada
      quantity,

      // Calcula o valor total do pedido
      total: product.price * quantity,

      // Data e hora da criação do pedido
      createdAt: new Date().toISOString()
    };

    // Adiciona o pedido no array
    orders.push(order);

    // Retorna status 201 (criado)
    // junto com o pedido criado
    return reply.status(201).send(order);
  }
);

// ======================
// INICIALIZAÇÃO DO SERVIDOR
// ======================
app.listen(
  {
    port: 3002,
    host: '0.0.0.0'
  },
  (err, address) => {

    // Se ocorrer erro ao iniciar
    if (err) {
      console.error(err);
      process.exit(1);
    }

    // Mensagem informando que o servidor iniciou
    console.log(`Order Service rodando em ${address}`);
  }
);