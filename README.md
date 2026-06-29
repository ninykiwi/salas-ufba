# salas-ufba
Trabalho final da disciplina de sistemas web 2026.1 da universidade federal da bahia

## Como Rodar o Projeto

> [!NOTE]
> Como este projeto foi recém-clonado, a pasta `node_modules` (onde ficam as dependências locais como React e Next.js) **não está presente** pois é ignorada pelo Git (`.gitignore`).
> Por conta disso, na primeira execução, tanto o script automatizado quanto o método manual solicitarão/exigirão a execução do comando `npm install` na pasta `frontend` para instalar essas dependências.
>
> Após essa primeira instalação, o projeto rodará diretamente nas próximas vezes.

Você pode rodar a aplicação de duas formas: utilizando o script automatizado de desenvolvimento ou manualmente passo a passo.

---

### Método 1: Utilizando o Script Automatizado (Recomendado)

O script `dev.sh` verifica as dependências necessárias, instala o que estiver faltando (perguntando a você antes) e inicia o servidor abrindo a aplicação direto no seu navegador.

1. Garanta que o script tem permissão de execução:
   ```bash
   chmod +x dev.sh
   ```

2. Execute o script:
   ```bash
   ./dev.sh
   ```

---

### Método 2: Execução Manual

Caso prefira rodar cada etapa manualmente:

1. **Instalar Dependências do Frontend**:
   Navegue até a pasta do frontend e instale as dependências com o npm:
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar o Servidor de Desenvolvimento**:
   Ainda na pasta `frontend`, inicie o servidor:
   ```bash
   npm run dev
   ```

3. **Acessar a Aplicação**:
   Abra o seu navegador e acesse o endereço:
   [http://localhost:3000](http://localhost:3000)
