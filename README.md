# PizzaShop Bun

Este projeto é uma API de gerenciamento de pizzaria desenvolvida em [Bun](https://bun.sh/) utilizando o framework [Elysia](https://elysiajs.com/), criada como parte dos estudos acompanhando as aulas da plataforma [Rocketseat](https://www.rocketseat.com.br/). O objetivo é fornecer um backend robusto para operações de restaurantes, pedidos, autenticação e métricas, com foco em boas práticas e arquitetura escalável.

---

## 📚 Descrição

A aplicação simula o backend de uma pizzaria, permitindo o cadastro de restaurantes, autenticação de usuários via link mágico, gerenciamento de pedidos (aprovação, despacho, entrega, cancelamento), além de fornecer métricas detalhadas sobre vendas e produtos populares. Todo o fluxo de autenticação, autorização e manipulação de dados segue padrões modernos de desenvolvimento web.

---

## 🚀 Funcionalidades

- **Cadastro de restaurantes**
- **Autenticação via link mágico**
- **Gerenciamento de pedidos** (aprovar, despachar, entregar, cancelar)
- **Consulta de métricas** (receita, pedidos do dia/mês, produtos populares)
- **Perfil do usuário autenticado**
- **Logout seguro**

---

## 🗂️ Estrutura de Pastas

```
src/
├── db/                # Módulos de banco de dados e schemas
│   ├── connection.ts
│   ├── migrate.ts
│   ├── seed.ts
│   └── schemas/
│       ├── auth-links.ts
│       ├── index.ts
│       ├── order-items.ts
│       ├── orders.ts
│       ├── products.ts
│       ├── restaurants.ts
│       └── users.ts
├── env/               # Configuração de variáveis de ambiente
│   └── schema.ts
├── http/              # Camada HTTP (rotas, middlewares, erros)
│   ├── app.ts
│   ├── auth.ts
│   ├── server.ts
│   ├── errors/
│   │   └── unauthorized-error.ts
│   └── routes/
│       ├── approve-order.ts
│       ├── authenticate-from-link.ts
│       ├── cancel-order.ts
│       ├── deliver-order.ts
│       ├── dispatch-order.ts
│       ├── fetch-orders.ts
│       ├── get -month-receipt.ts
│       ├── get-daily-receipt-in-period.ts
│       ├── get-day-orders-amount.ts
│       ├── get-managed-restaurant.ts
│       ├── get-month-canceled-orders-amount.ts
│       ├── get-month-orders-amount.ts
│       ├── get-order-details.ts
│       ├── get-popular-products.ts
│       ├── get-profile.ts
│       ├── register-restaurant.ts
│       ├── send-auth-link.ts
│       └── sing-out.ts
├── lib/               # Bibliotecas auxiliares
│   └── mail.ts
```

---

## 🛣️ Rotas da API

### Autenticação & Usuário

- `POST /restaurants`  
  Cadastra um novo restaurante.

- `POST /auth-links`  
  Envia um link mágico de autenticação para o e-mail informado.

- `POST /authenticate`  
  Realiza autenticação a partir do link mágico.

- `GET /me`  
  Retorna o perfil do usuário autenticado.

- `POST /sign-out`  
  Realiza logout do usuário.

---

### Restaurante

- `GET /managed-restaurant`  
  Retorna o restaurante gerenciado pelo usuário autenticado.

---

### Pedidos

- `GET /orders?pageIndex=0`  
  Lista pedidos do restaurante.

- `GET /orders/:orderId`  
  Detalhes de um pedido específico.

- `POST /orders/:orderId/approve`  
  Aprova um pedido.

- `POST /orders/:orderId/dispatch`  
  Marca pedido como despachado.

- `POST /orders/:orderId/deliver`  
  Marca pedido como entregue.

- `POST /orders/:orderId/cancel`  
  Cancela um pedido.

---

### Métricas

- `GET /metrics/month-receipt`  
  Receita total do mês.

- `GET /metrics/day-orders-amount`  
  Quantidade de pedidos do dia.

- `GET /metrics/month-orders-amount`  
  Quantidade de pedidos do mês.

- `GET /metrics/month-canceled-orders-amount`  
  Quantidade de pedidos cancelados no mês.

- `GET /metrics/popular-products`  
  Produtos mais vendidos.

- `GET /metrics/daily-receipt-in-period?start=YYYY-MM-DD&end=YYYY-MM-DD`  
  Receita diária em um período.

---

## ⚙️ Funcionamento Detalhado

- **Autenticação:**  
  O usuário solicita um link mágico via e-mail. Ao acessar o link, recebe um token de autenticação (JWT) armazenado em cookie seguro.

- **Pedidos:**  
  O restaurante pode aprovar, despachar, entregar ou cancelar pedidos. Cada ação é registrada e pode ser consultada via rotas específicas.

- **Métricas:**  
  Métricas de vendas e pedidos são calculadas em tempo real, permitindo ao restaurante acompanhar o desempenho do negócio.

- **Segurança:**  
  Todas as rotas sensíveis exigem autenticação via cookie JWT. Erros de autenticação são tratados de forma padronizada.

---


## 🧩 Bibliotecas e Dependências

- **[Bun](https://bun.sh/):** Runtime ultrarrápido para JavaScript/TypeScript, responsável por executar o projeto e gerenciar dependências.
- **[Elysia](https://elysiajs.com/):** Framework web minimalista e performático para criar APIs HTTP com tipagem forte e middlewares.
- **[JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken):** Utilizado para geração e validação de tokens de autenticação seguros.
- **[Zod](https://zod.dev/):** Biblioteca de validação e tipagem de dados, garantindo segurança e integridade dos dados recebidos nas rotas.
- **[SQLite](https://www.sqlite.org/index.html) / [Drizzle ORM](https://orm.drizzle.team/):** Banco de dados leve e ORM para manipulação de dados de forma tipada e segura.
- **[Nodemailer](https://nodemailer.com/):** Envio de e-mails para o fluxo de autenticação via link mágico.
- **[dotenv](https://github.com/motdotla/dotenv):** Carregamento de variáveis de ambiente de forma segura.
- **[VSCode REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client):** Extensão recomendada para testar as rotas via arquivo `client.http`.

> Outras dependências podem estar presentes para suporte a testes, scripts de migração e seed, e utilitários internos.

---

## 🧑‍💻 Como rodar o projeto

1. Instale as dependências:
   ```bash
   bun install
   ```
2. Configure as variáveis de ambiente conforme necessário.
3. Execute as migrações e seeds do banco:
   ```bash
   bun run src/db/migrate.ts
   bun run src/db/seed.ts
   ```
4. Inicie o servidor:
   ```bash
   bun run src/http/server.ts
   ```

---

## 📒 Observações

- Este projeto foi desenvolvido acompanhando as aulas da Rocketseat, focando em aprendizado prático de Bun, Elysia e arquitetura de APIs modernas.
- Para testar as rotas, utilize o arquivo `client.http` na raiz do projeto com o plugin REST Client do VSCode.

---

## 📫 Contato

Projeto de estudo baseado nas aulas da [Rocketseat](https://www.rocketseat.com.br/).