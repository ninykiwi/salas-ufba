#!/bin/bash

# Cores para o terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'
CYAN='\033[0;36m'

echo -e "${BLUE}=== Verificação de Requisitos do Sistema ===${NC}\n"

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
        echo -e "${RED}Erro: Node.js é necessário para rodar o frontend.${NC}"
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
        echo -e "${RED}Erro: npm é necessário para instalar as dependências do frontend.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}[OK] npm está instalado ($(npm -v))${NC}"
fi

# 3. Verificar dependências do frontend (node_modules)
FRONTEND_DIR="/home/magno-macedo/SistemasWeb/salas-ufba/frontend"
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

echo -e "\n${GREEN}=== Todos os requisitos foram verificados e atendidos! ===${NC}\n"

# 4. Iniciar o servidor e abrir no navegador
echo -e "${BLUE}Iniciando o servidor frontend local...${NC}"

# Iniciar o servidor de desenvolvimento do Next.js em segundo plano
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Função para parar o servidor ao encerrar o script
cleanup() {
    echo -e "\n${RED}Encerrando o servidor frontend (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

echo -e "${YELLOW}Aguardando o servidor iniciar na porta 3000...${NC}"

# Loop para aguardar a porta 3000 ficar disponível
for i in {1..30}; do
    if lsof -i :3000 -t &> /dev/null || curl -s http://localhost:3000 &> /dev/null; then
        echo -e "${GREEN}Servidor iniciado com sucesso!${NC}"
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

# Manter o script ativo mostrando os logs do Next.js
wait $FRONTEND_PID
