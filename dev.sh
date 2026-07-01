#!/bin/bash

# Cores para o terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'
CYAN='\033[0;36m'

echo -e "${BLUE}=== Verificação de Requisitos do Sistema (Frontend + Backend) ===${NC}\n"

# Função para perguntar ao usuário
ask_permission() {
    local item="$1"
    local command_to_run="$2"
    echo -e "${YELLOW}O requisito [${item}] não está atendido.${NC}"
    echo -e "Comando sugerido: ${CYAN}${command_to_run}${NC}"
    read -p "Você deseja baixar/instalar isso agora? (s/n): " choice
    case "$choice" in
        [sS]|[yY]|[sS][iI])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    if ask_permission "Node.js" "sudo apt update && sudo apt install -y nodejs"; then
        echo -e "${YELLOW}Instalando Node.js...${NC}"
        sudo apt update && sudo apt install -y nodejs
    else
        echo -e "${RED}Erro: Node.js é necessário para rodar o projeto.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Node.js está instalado ($(node -v))${NC}"
fi

# 2. Verificar npm
if ! command -v npm &> /dev/null; then
    if ask_permission "npm (Node Package Manager)" "sudo apt install -y npm"; then
        echo -e "${YELLOW}Instalando npm...${NC}"
        sudo apt install -y npm
    else
        echo -e "${RED}Erro: npm é necessário para instalar as dependências.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] npm está instalado ($(npm -v))${NC}"
fi

# 3. Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Erro: Docker não está instalado. É necessário para rodar o banco de dados PostgreSQL.${NC}"
    exit 1
else
    echo -e "${GREEN}[OK] Docker está instalado ($(docker -v))${NC}"
fi

# 4. Verificar Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Erro: Docker Compose não está instalado/ativo. Necessário para o banco de dados.${NC}"
    exit 1
else
    echo -e "${GREEN}[OK] Docker Compose está instalado ($(docker compose version))${NC}"
fi

# 5. Verificar dependências do frontend (node_modules)
FRONTEND_DIR="/home/magno-macedo/SistemasWeb/salas-ufba/web"
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    if ask_permission "Dependências do frontend (node_modules)" "cd $FRONTEND_DIR && npm install"; then
        echo -e "${YELLOW}Instalando dependências do frontend...${NC}"
        (cd "$FRONTEND_DIR" && npm install)
    else
        echo -e "${RED}Erro: Dependências do frontend são necessárias para rodar o projeto.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Dependências do frontend (node_modules) já estão instaladas.${NC}"
fi

# 6. Verificar dependências do backend (node_modules)
BACKEND_DIR="/home/magno-macedo/SistemasWeb/salas-ufba/auth-service"
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    if ask_permission "Dependências do backend (node_modules)" "cd $BACKEND_DIR && npm install"; then
        echo -e "${YELLOW}Instalando dependências do backend...${NC}"
        (cd "$BACKEND_DIR" && npm install)
    else
        echo -e "${RED}Erro: Dependências do backend são necessárias para rodar o projeto.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Dependências do backend (node_modules) já estão instaladas.${NC}"
fi

# 6.5. Verificar dependências do API Gateway (node_modules)
GATEWAY_DIR="/home/magno-macedo/SistemasWeb/salas-ufba/api-gateway"
if [ ! -d "$GATEWAY_DIR/node_modules" ]; then
    if ask_permission "Dependências do API Gateway (node_modules)" "cd $GATEWAY_DIR && npm install"; then
        echo -e "${YELLOW}Instalando dependências do API Gateway...${NC}"
        (cd "$GATEWAY_DIR" && npm install)
    else
        echo -e "${RED}Erro: Dependências do API Gateway são necessárias para rodar o projeto.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] Dependências do API Gateway (node_modules) já estão instaladas.${NC}"
fi

echo -e "\n${GREEN}=== Todos os requisitos foram verificados e atendidos! ===${NC}\n"

# 7. Iniciar o Banco de Dados com Docker Compose
echo -e "${BLUE}Iniciando o banco de dados PostgreSQL via Docker Compose...${NC}"
docker compose -f /home/magno-macedo/SistemasWeb/salas-ufba/infra/docker-compose.yml up -d

# 8. Rodar migrações do banco (Prisma)
echo -e "${BLUE}Rodando migrações do banco de dados (Prisma)...${NC}"
(cd "$BACKEND_DIR" && npx prisma migrate deploy && npx prisma generate)

# 9. Iniciar os servidores
echo -e "${BLUE}Iniciando o servidor backend (porta 3002) em segundo plano...${NC}"
cd "$BACKEND_DIR"
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${BLUE}Iniciando o API Gateway (porta 3001) em segundo plano...${NC}"
cd "$GATEWAY_DIR"
npm run start:dev > gateway.log 2>&1 &
GATEWAY_PID=$!

echo -e "${BLUE}Iniciando o servidor frontend (porta 3000) em segundo plano...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Função para parar os servidores ao encerrar o script
cleanup() {
    echo -e "\n${RED}Encerrando os servidores (Frontend PID: $FRONTEND_PID, Backend PID: $BACKEND_PID, Gateway PID: $GATEWAY_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $GATEWAY_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo -e "${YELLOW}Aguardando os servidores iniciarem...${NC}"

# Loop para aguardar as portas ficarem disponíveis
for i in {1..30}; do
    if (lsof -i :3000 -t &> /dev/null || curl -s http://localhost:3000 &> /dev/null) && \
       (lsof -i :3001 -t &> /dev/null) && \
       (lsof -i :3002 -t &> /dev/null); then
        echo -e "${GREEN}Servidores e Gateway iniciados com sucesso!${NC}"
        break
    fi
    sleep 1
done

# Abrir no navegador do usuário
echo -e "${BLUE}Abrindo o navegador em http://localhost:3000...${NC}"
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v sensible-browser &> /dev/null; then
    sensible-browser http://localhost:3000
else
    python3 -m webbrowser http://localhost:3000
fi

# Manter o script ativo mostrando os logs do Next.js e do NestJS
echo -e "${GREEN}Logs do Backend salvos em: $BACKEND_DIR/backend.log${NC}"
echo -e "${GREEN}Logs do Gateway salvos em: $GATEWAY_DIR/gateway.log${NC}"
wait $FRONTEND_PID
