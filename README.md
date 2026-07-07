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

1. Copie o `.env.example` da raiz para `.env` com o seguinte comando:
   ```bash
   Linux: cp .env.example .env

   Windows: copy .env.example .env
   ```

2. Adicione uma string qualquer a variavel ```JWT_SECRET```. 
    ```bash
    Por exemplo: JWT_SECRET=qualquercoisa
    ```

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

## Primeiro Acesso

O `auth-service` não tem mais seed automático de usuários. Para criar o primeiro usuário (SUPERADMIN) do zero, rode o script manual dentro do container ou localmente (com o Postgres acessível e o `.env` da raiz preenchido):

```bash
docker compose exec auth-service npx ts-node scripts/create-superadmin.ts --name "Admin" --email "admin@ufba.br" --password "Senha123!"
```

O script:
- valida a senha com as mesmas regras de complexidade da API (mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial);
- aborta se já existir um usuário com o e-mail informado;
- cria o usuário direto no banco com `role: SUPERADMIN`.

A partir do SUPERADMIN criado, os demais usuários (ADMIN, PROFESSOR) podem ser cadastrados pela própria aplicação.
