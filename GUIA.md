# Como rodar o projeto

Este projeto foi desenvolvido utilizando:

- Node.js
- TypeScript
- Fastify
- npm Workspaces

A aplicação segue uma arquitetura de microserviços.

Atualmente existem dois serviços independentes:

- Product Service
- Order Service

---

# Estrutura do projeto

```text
microservicos-av
│
├── apps
│   ├── product-service
│   └── order-service
│
├── package.json
└── tsconfig.json
```

---

# Instalação do projeto

Antes de executar os serviços, instale as dependências na raiz do projeto:

```bash
npm install
```

---

# Product Service

Responsável pelo catálogo de produtos da aplicação.

## Porta utilizada

```text
30001
```

## Rotas disponíveis

### Listar produtos

```http
GET /products
```

### Buscar produto por ID

```http
GET /products/:id
```

## Como executar

Abra um terminal na raiz do projeto e execute:

```bash
npm run product
```

## Exemplos de teste

### Listar produtos

```bash
curl http://localhost:30001/products
```

### Buscar produto por ID

```bash
curl http://localhost:30001/products/1
```

---

# Order Service

Responsável pelo cadastro e listagem de pedidos.

## Porta utilizada

```text
3002
```

## Rotas disponíveis

### Listar pedidos

```http
GET /orders
```

### Criar pedido

```http
POST /orders
```

## Como executar

Abra outro terminal na raiz do projeto e execute:

```bash
npm run order
```

## Exemplos de teste

### Listar pedidos

```bash
curl http://localhost:3002/orders
```

### Criar pedido no PowerShell

```powershell
curl.exe -X POST http://localhost:3002/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":1,\"quantity\":2}'
```

## Resultado esperado

```json
{
  "id": 1,
  "productId": 1,
  "quantity": 2,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

---

# Como executar os dois serviços juntos

Para executar os dois serviços ao mesmo tempo, abra dois terminais separados.

## Terminal 1

```bash
npm run product
```

## Terminal 2

```bash
npm run order
```

---

# Observações

- Cada microserviço roda em uma porta diferente.
- O Product Service roda na porta `30001`.
- O Order Service roda na porta `3002`.
- Nesta etapa, os serviços ainda não se comunicam entre si.
- A comunicação HTTP entre os serviços será implementada na próxima branch: `step/04-http-communication`.