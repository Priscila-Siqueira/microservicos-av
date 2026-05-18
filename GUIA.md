# Guia do Projeto — Microserviços com Node.js

Este projeto foi desenvolvido utilizando:

- Node.js
- TypeScript
- Fastify
- npm Workspaces

A aplicação segue uma arquitetura de microserviços.

Até o momento, foram desenvolvidas as branches:

- `step/01-setup`
- `step/02-product-service`
- `step/03-order-service`
- `step/04-http-communication`

---

# 1. Configuração inicial do monorepo

## Nome da branch

```text
step/01-setup
```

## Explicação

Nesta branch foi criada a estrutura inicial do projeto.

O objetivo foi preparar o repositório para trabalhar com mais de um microserviço dentro do mesmo projeto, usando `npm workspaces`.

Com isso, todos os serviços ficam dentro da pasta `apps`, mas continuam sendo projetos separados.

## O que foi feito

- Criação do projeto base
- Criação do `package.json` principal
- Configuração do `npm workspaces`
- Criação do `tsconfig.json`
- Criação da pasta `apps`

## Estrutura criada

```text
microservicos-av
│
├── apps
│
├── package.json
└── tsconfig.json
```

## Comandos para mostrar funcionando

### Instalar dependências

```bash
npm install
```

### Verificar estrutura do projeto

```bash
dir
```

No Git Bash ou Linux:

```bash
ls
```

### Verificar pasta de aplicações

```bash
dir apps
```

No Git Bash ou Linux:

```bash
ls apps
```

---

# 2. Criação do Product Service

## Nome da branch

```text
step/02-product-service
```

## Explicação

Nesta branch foi criado o primeiro microserviço da aplicação: o `Product Service`.

Esse serviço é responsável pelo catálogo de produtos.

Ele possui dados de produtos dentro do próprio código e expõe rotas HTTP para listar produtos e buscar um produto pelo ID.

## O que foi feito

- Criação do `product-service`
- Configuração do Fastify
- Criação da interface `Product`
- Criação de uma lista de produtos
- Criação da rota para listar produtos
- Criação da rota para buscar produto por ID
- Execução do serviço na porta `30001`

## Estrutura criada

```text
apps
└── product-service
    ├── package.json
    └── src
        └── server.ts
```

## Rotas criadas

```http
GET /products
GET /products/:id
```

## Comandos para mostrar funcionando

### Subir o Product Service

```bash
npm run product
```

Resultado esperado:

```text
Servidor rodando em http://0.0.0.0:30001
```

### Listar produtos

```bash
curl http://localhost:30001/products
```

### Buscar produto por ID

```bash
curl http://localhost:30001/products/1
```

### Buscar produto inexistente

```bash
curl http://localhost:30001/products/999
```

Resultado esperado:

```json
{
  "message": "Produto não encontrado"
}
```

---

# 3. Criação do Order Service

## Nome da branch

```text
step/03-order-service
```

## Explicação

Nesta branch foi criado o segundo microserviço da aplicação: o `Order Service`.

Esse serviço é responsável por criar e listar pedidos.

Nesta etapa, o `Order Service` ainda não se comunica com o `Product Service`. Ele apenas recebe o `productId` informado na criação do pedido e salva o pedido em memória.

## O que foi feito

- Criação do `order-service`
- Configuração do Fastify
- Criação da interface `Order`
- Criação de uma lista de pedidos
- Criação da rota para listar pedidos
- Criação da rota para criar pedidos
- Execução do serviço na porta `3002`
- Criação da documentação inicial do projeto

## Estrutura criada

```text
apps
├── product-service
└── order-service
    ├── package.json
    └── src
        └── server.ts
```

## Rotas criadas

```http
GET /orders
POST /orders
```

## Comandos para mostrar funcionando

### Subir o Order Service

```bash
npm run order
```

Resultado esperado:

```text
Order Service rodando em http://0.0.0.0:3002
```

### Listar pedidos

```bash
curl http://localhost:3002/orders
```

Resultado esperado inicial:

```json
[]
```

### Criar pedido no PowerShell

```powershell
curl.exe -X POST http://localhost:3002/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":1,\"quantity\":2}'
```

Resultado esperado:

```json
{
  "id": 1,
  "productId": 1,
  "quantity": 2,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Listar pedidos após criação

```bash
curl http://localhost:3002/orders
```

Resultado esperado:

```json
[
  {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

# 4. Comunicação HTTP entre os serviços

## Nome da branch

```text
step/04-http-communication
```

## Explicação

Nesta branch foi adicionada a comunicação HTTP entre os microserviços.

Agora, quando um pedido é criado no `Order Service`, ele consulta o `Product Service` para buscar os dados do produto.

Com isso, o pedido deixa de ter apenas o `productId` e passa a retornar também:

- `productName`
- `total`

O campo `total` é calculado usando o preço do produto multiplicado pela quantidade informada no pedido.

## O que foi feito

- O `Order Service` passou a consultar o `Product Service`
- Foi usada comunicação HTTP síncrona com `fetch`
- Foi criada a interface `Product` dentro do `Order Service`
- O pedido passou a retornar o nome do produto
- O pedido passou a retornar o valor total
- Foi adicionado tratamento para produto inexistente
- Foi configurada a URL padrão do Product Service

## Fluxo implementado

```text
Cliente
  │
  ▼
POST /orders
  │
  ▼
Order Service
  │
  ▼
GET /products/:id
  │
  ▼
Product Service
```

## URL padrão utilizada

```text
http://localhost:30001
```

## Como executar os serviços juntos

Para testar esta etapa, os dois serviços precisam estar rodando ao mesmo tempo.

### Terminal 1 — subir Product Service

```bash
npm run product
```

Resultado esperado:

```text
Servidor rodando em http://0.0.0.0:30001
```

### Terminal 2 — subir Order Service

```bash
npm run order
```

Resultado esperado:

```text
Order Service rodando em http://0.0.0.0:3002
```

## Comandos para mostrar funcionando

### Testar Product Service

```bash
curl http://localhost:30001/products
```

### Testar Order Service vazio

```bash
curl http://localhost:3002/orders
```

Resultado esperado inicial:

```json
[]
```

### Criar pedido com comunicação entre serviços

No PowerShell:

```powershell
curl.exe -X POST http://localhost:3002/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":1,\"quantity\":3}'
```

Resultado esperado:

```json
{
  "id": 1,
  "productId": 1,
  "productName": "Notebook Pro",
  "quantity": 3,
  "total": 10500,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Listar pedidos após criação

```bash
curl http://localhost:3002/orders
```

Resultado esperado:

```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Notebook Pro",
    "quantity": 3,
    "total": 10500,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### Testar produto inexistente

No PowerShell:

```powershell
curl.exe -X POST http://localhost:3002/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":999,\"quantity\":1}'
```

Resultado esperado:

```json
{
  "error": "Produto não encontrado no Product Service"
}
```

---

# 5. Implementação do API Gateway

## Nome da branch

```text
step/05-api-gateway
```

## Explicação

Nesta branch foi implementado o `API Gateway` da aplicação.

O API Gateway funciona como um ponto central de entrada para os microsserviços.

Agora, o cliente não precisa mais acessar diretamente o `Product Service` ou o `Order Service`.

Todas as requisições passam primeiro pelo Gateway, que redireciona as chamadas para os serviços corretos.

Essa abordagem facilita:

- Centralização das rotas
- Organização da arquitetura
- Controle de acesso
- Escalabilidade
- Manutenção futura da aplicação

## O que foi feito

- Criação do `api-gateway`
- Configuração do Fastify
- Configuração do `@fastify/http-proxy`
- Proxy para o Product Service
- Proxy para o Order Service
- Criação da rota de Health Check
- Centralização das requisições da aplicação
- Execução do Gateway na porta `3000`

## Estrutura criada

```text
apps
├── api-gateway
├── product-service
└── order-service
```

## Rotas disponíveis

### Produtos

```http
GET /products
GET /products/:id
```

### Pedidos

```http
GET /orders
POST /orders
```

### Health Check

```http
GET /health
```

## Fluxo implementado

```text
Cliente
   │
   ▼
API Gateway
   │
   ├──► Product Service
   │
   └──► Order Service
```

## Como executar os serviços

Agora os três serviços precisam estar rodando ao mesmo tempo.

### Terminal 1 — subir Product Service

```bash
npm run product
```

Resultado esperado:

```text
Servidor rodando em http://0.0.0.0:30001
```

### Terminal 2 — subir Order Service

```bash
npm run order
```

Resultado esperado:

```text
Order Service rodando em http://0.0.0.0:3002
```

### Terminal 3 — subir API Gateway

```bash
npm run gateway
```

Resultado esperado:

```text
API Gateway rodando em http://0.0.0.0:3000
```

## Comandos para mostrar funcionando

### Testar Health Check

```bash
curl http://localhost:3000/health
```

Resultado esperado:

```json
{
  "status": "ok"
}
```

### Listar produtos pelo Gateway

```bash
curl http://localhost:3000/products
```

### Buscar produto pelo Gateway

```bash
curl http://localhost:3000/products/1
```

### Criar pedido pelo Gateway

No PowerShell:

```powershell
curl.exe -X POST http://localhost:3000/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":1,\"quantity\":2}'
```

Resultado esperado:

```json
{
  "id": 1,
  "productId": 1,
  "productName": "Notebook Pro",
  "quantity": 2,
  "total": 7000,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Listar pedidos pelo Gateway

```bash
curl http://localhost:3000/orders
```

Resultado esperado:

```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Notebook Pro",
    "quantity": 2,
    "total": 7000,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

# 6. Dockerização da aplicação

## Nome da branch

```text
step/06-docker
```

## Explicação

Nesta branch foi realizada a dockerização completa da aplicação.

Cada microsserviço passou a possuir seu próprio container Docker.

Além disso, foi criado um arquivo `docker-compose.yml` para permitir subir toda a arquitetura com apenas um comando.

Com Docker, a aplicação passa a ter:

- Ambiente padronizado
- Facilidade de execução
- Maior portabilidade
- Facilidade de deploy
- Isolamento entre serviços

## O que foi feito

- Criação dos arquivos `Dockerfile`
- Criação do `docker-compose.yml`
- Configuração dos containers
- Configuração das portas dos serviços
- Configuração da rede entre containers
- Execução conjunta de todos os microsserviços

## Estrutura adicionada

```text
microservicos-av
│
├── apps
│   ├── api-gateway
│   ├── order-service
│   └── product-service
│
├── docker-compose.yml
```

## Containers da aplicação

| Serviço | Porta |
|---|---|
| API Gateway | 3000 |
| Product Service | 30001 |
| Order Service | 3002 |

## Como executar com Docker

### Build e inicialização dos containers

```bash
docker-compose up --build
```

## Resultado esperado

Todos os serviços devem iniciar corretamente.

Exemplo:

```text
API Gateway rodando em http://0.0.0.0:3000
Product Service rodando em http://0.0.0.0:30001
Order Service rodando em http://0.0.0.0:3002
```

## Comandos para testar a aplicação

### Health Check

```bash
curl http://localhost:3000/health
```

Resultado esperado:

```json
{
  "status": "ok"
}
```

### Listar produtos

```bash
curl http://localhost:3000/products
```

### Criar pedido

No PowerShell:

```powershell
curl.exe -X POST http://localhost:3000/orders `
  -H "Content-Type: application/json" `
  --data '{\"productId\":1,\"quantity\":2}'
```

Resultado esperado:

```json
{
  "id": 1,
  "productId": 1,
  "productName": "Notebook Pro",
  "quantity": 2,
  "total": 7000,
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

### Listar pedidos

```bash
curl http://localhost:3000/orders
```

Resultado esperado:

```json
[
  {
    "id": 1,
    "productId": 1,
    "productName": "Notebook Pro",
    "quantity": 2,
    "total": 7000,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

# Observações gerais

- Cada branch representa uma evolução do projeto.
- Cada microserviço possui sua própria responsabilidade.
- O Product Service roda na porta `30001`.
- O Order Service roda na porta `3002`.
- O API Gateway roda na porta `3000`.
- Até a branch `step/03-order-service`, os serviços eram independentes.
- A partir da branch `step/04-http-communication`, o Order Service passou a consultar o Product Service.
- A partir da branch `step/05-api-gateway`, todas as requisições passaram a ser centralizadas pelo Gateway.
- Na branch `step/06-docker`, toda a aplicação passou a rodar em containers Docker.
- O projeto evoluiu gradualmente até chegar em uma arquitetura completa baseada em microsserviços.