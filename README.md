# salas-ufba
Trabalho final da disciplina de sistemas web 2026.1 da universidade federal da bahia

## Estrutura de Pastas

```
/
  services/
    auth-service/   # NestJS - autenticação, usuários e institutos (porta 3002)
    api-gateway/     # NestJS - proxy/gateway para o auth-service (porta 3001)
    bff/             # FastAPI - Backend For Frontend consumido pelo web (porta 8000)
  web/               # Next.js - frontend (porta 3000)
  infra/             # docker-compose auxiliar (apenas postgres, uso standalone)
  docker-compose.yml # orquestra todos os serviços acima
  .env.example       # todas as variáveis de ambiente de todos os serviços
```

## Pré-requisitos

- Docker
- Docker Compose

## Como Rodar o Projeto

1. Copie o `.env.example` da raiz para `.env` e preencha as variáveis sensíveis:
   ```bash
   cp .env.example .env
   ```
   Um único `.env` na raiz concentra as variáveis de todos os serviços (postgres, auth-service, api-gateway, bff e web) - o Docker Compose já lê esse arquivo automaticamente. Não há mais `.env` individuais dentro de `services/*`.

2. Suba todos os serviços com Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

`Ctrl+C` derruba os containers (ou rode `docker compose down` em outro terminal).

## Portas

| Serviço | Porta |
|---|---|
| web (Next.js) | 3000 |
| api-gateway | 3001 |
| auth-service | 3002 |
| bff (FastAPI) | 8000 |
| postgres | 5432 |

## Credenciais do Seed (ambiente de desenvolvimento)

Ao subir pela primeira vez, o `auth-service` cria automaticamente um instituto padrão e um usuário de cada papel, caso não existam:

| Papel | E-mail | Senha padrão* |
|---|---|---|
| SUPERADMIN | superadmin@ufba.br | `SuperAdminPassword123!` |
| ADMIN | admin@ufba.br | `AdminPassword123!` |
| PROFESSOR | professor@ufba.br | `ProfessorPassword123!` |

\* Usadas apenas se `SEED_SUPERADMIN_PASSWORD`, `SEED_ADMIN_PASSWORD` e `SEED_PROFESSOR_PASSWORD` não forem definidas no `.env` da raiz. O seed nunca roda em `NODE_ENV=production`.
