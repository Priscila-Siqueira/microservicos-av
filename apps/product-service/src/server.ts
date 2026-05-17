import Fastify from 'fastify';

// Definindo a interface para os produtos
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const app = Fastify();

// Simulando um banco de dados com uma lista de produtos (dados em memória)
const products: Product[] = [
  { id: 1, name: 'Notebook Pro', price: 3500, stock: 10 },
  { id: 2, name: 'Mouse Gamer', price: 150, stock: 50 },
  { id: 3, name: 'Teclado Mecânico', price: 200, stock: 25 }
];

// Rotas REST para listar todos os produtos
app.get('/products', async (request, reply) => {
  return products;
});

// Rota para obter um produto específico por ID
app.get('/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const product = products.find(p => p.id === parseInt(id));
  if (product) {
    return product;
  } else {
    reply.status(404).send({ message: 'Produto não encontrado' });
  }
});

// Iniciando o servidor
app.listen({port: 3001, host: '0.0.0.0'}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
});
