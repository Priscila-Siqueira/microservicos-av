# Microsserviços com Node.js, Fastify e Docker

## 📌 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de demonstrar uma arquitetura baseada em microsserviços utilizando Node.js, TypeScript, Fastify e Docker.

A aplicação é composta por três microsserviços principais:

* Product Service → responsável pelo gerenciamento de produtos
* Order Service → responsável pela criação de pedidos
* API Gateway → responsável pela centralização e roteamento das requisições

O projeto utiliza comunicação HTTP entre os serviços e conteinerização com Docker Compose.

---

# 🏗️ Arquitetura do Projeto

```text
Cliente
   ↓
API Gateway (3000)
   ↓
 ┌─────────────────────┐
 ↓                     ↓
Product Service     Order Service
   (3001)              (3002)
```

---

# 📁 Estrutura do Projeto

```text
microservicos-av/
│
├── apps/
│   ├── api-gateway/
│   ├── order-service/
│   └── product-service/
│
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

# 🚀 Tecnologias Utilizadas

* Node.js
* TypeScript
* Fastify
* Fastify HTTP Proxy
* Docker
* Docker Compose

---

# ⚙️ Microsserviços

## 📦 Product Service

Responsável pelo gerenciamento dos produtos.

### Funcionalidades

* Listar produtos
* Buscar produto por ID

### Porta

```text
3001
```

### Rotas

#### Listar produtos

```http
GET /products
```

#### Buscar produto por ID

```http
GET /products/:id
```

### Exemplo de Resposta

```json
[
  {
    "id": 1,
    "name": "Notebook Pro",
    "price": 3500,
    "stock": 10
  }
]
```

---

## 🛒 Order Service

Responsável pelo gerenciamento dos pedidos.

### Funcionalidades

* Criar pedidos
* Listar pedidos
* Comunicação com Product Service

### Porta

```text
3002
```

### Rotas

#### Listar pedidos

```http
GET /orders
```

#### Criar pedido

```http
POST /orders
```

### Body da Requisição

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "productId": 1,
  "productName": "Notebook Pro",
  "quantity": 2,
  "total": 7000,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## 🌐 API Gateway

Responsável por centralizar e redirecionar as requisições para os microsserviços.

### Porta

```text
3000
```

### Funcionalidades

* Proxy para Product Service
* Proxy para Order Service
* Health Check

### Rotas

#### Produtos

```http
GET /products
```

#### Pedidos

```http
GET /orders
POST /orders
```

#### Health Check

```http
GET /health
```

### Exemplo de Resposta

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

# 🐳 Executando com Docker

## Pré-requisitos

* Docker
* Docker Compose

## Executar o projeto

```bash
docker-compose up --build
```

---

# ▶️ Executando Manualmente

## Instalar dependências

```bash
npm install
```

## Executar Product Service

```bash
npm run product
```

## Executar Order Service

```bash
npm run order
```

## Executar API Gateway

```bash
npm run gateway
```

---

# 🔗 Endpoints Principais

## Listar Produtos

```http
GET http://localhost:3000/products
```

## Buscar Produto por ID

```http
GET http://localhost:3000/products/1
```

## Criar Pedido

```http
POST http://localhost:3000/orders
```

### Body

```json
{
  "productId": 1,
  "quantity": 2
}
```

## Listar Pedidos

```http
GET http://localhost:3000/orders
```

---

# 🔄 Comunicação Entre Microsserviços

O Order Service realiza requisições HTTP para o Product Service para validar e obter informações dos produtos antes de criar um pedido.

A comunicação acontece através da variável de ambiente:

```env
PRODUCT_SERVICE_URL
```

O API Gateway atua como ponto central de entrada da aplicação, redirecionando as requisições para os microsserviços corretos.

---

# 🧪 Testando a API

Você pode utilizar ferramentas como:

* Postman
* Insomnia
* Thunder Client

---

# 📚 Conceitos Aplicados

* Arquitetura de Microsserviços
* API Gateway
* Comunicação HTTP entre serviços
* Dockerização
* Containers
* Proxy reverso
* APIs REST
* TypeScript
* Fastify

---

# 👩‍💻 Autora

Projeto desenvolvido para fins acadêmicos e aprendizado de arquitetura de microsserviços com Node.js.

