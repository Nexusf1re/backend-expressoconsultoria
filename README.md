# Analytics API

API RESTful dinâmica para dados de gráficos com Node.js, TypeScript, Express e Prisma.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js >= 18.0.0
- MySQL 8.0+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Nexusf1re/backend-expressoconsultoria.git
cd backend-expressoconsultoria
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Configure as variáveis de ambiente no .env
```

4. **Configure o banco de dados**
```bash
# Execute as migrações
npm run prisma:migrate

# Popule com dados de exemplo
npm run prisma:seed
```

5. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📊 Funcionalidades

### Tipos de Gráficos Suportados
- **Pizza** (`/charts/pie`) - Dados categóricos
- **Linha** (`/charts/line`) - Séries temporais
- **Barras** (`/charts/bar`) - Comparação categórica
- **Área** (`/charts/area`) - Séries temporais múltiplas

### Dimensões de Agrupamento
- **Categoria** (`category`) - Agrupa por categoria do produto
- **Região** (`region`) - Agrupa por região geográfica
- **Produto** (`product`) - Agrupa por produto específico
- **Canal** (`channel`) - Agrupa por canal de venda

### Métricas Disponíveis
- **Soma** (`sum(amount)`) - Soma dos valores
- **Média** (`avg(amount)`) - Média dos valores
- **Contagem** (`count(*)`) - Número de registros

## 🔗 Endpoints da API

### Health Check
```http
GET /health
```

### Gráficos
```http
GET /charts/{type}?startDate=2024-01-01&endDate=2024-12-31&dimension=category
```

#### Parâmetros de Query
- `startDate` (obrigatório) - Data de início (YYYY-MM-DD)
- `endDate` (obrigatório) - Data de fim (YYYY-MM-DD)
- `dimension` - Dimensão para agrupamento (category, region, product, channel)
- `groupBy` - Agrupamento temporal (day, week, month)
- `metric` - Métrica de cálculo (sum(amount), avg(amount), count(*))
- `limit` - Limite de resultados (1-100)
- `order` - Ordem de classificação (asc, desc)
- `splitBy` - Dimensão para divisão de séries

### Documentação
```http
GET /docs
```

## 📝 Exemplos de Uso

### Gráfico de Pizza por Categoria
```bash
curl "http://localhost:3000/charts/pie?startDate=2025-01-01&endDate=2025-12-31&dimension=category"
```

### Gráfico de Linha por Dia
```bash
curl "http://localhost:3000/charts/line?startDate=2025-01-01&endDate=2025-12-31&groupBy=day"
```

### Gráfico de Barras por Região
```bash
curl "http://localhost:3000/charts/bar?startDate=2025-01-01&endDate=2025-12-31&dimension=region"
```

### Gráfico de Área por Canal
```bash
curl "http://localhost:3000/charts/area?startDate=2025-01-01&endDate=2025-12-31&groupBy=week&splitBy=channel"
```

## 🏗️ Arquitetura

### Estrutura do Projeto
```
src/
├── config/          # Configurações (database, logger, env)
├── controllers/     # Controladores HTTP
├── middlewares/     # Middlewares (error, logging, request-id)
├── modules/         # Módulos de negócio
│   └── charts/      # Módulo de gráficos
│       ├── factories/    # Factory para estratégias
│       ├── interfaces/   # Interfaces das estratégias
│       ├── services/     # Serviços de negócio
│       └── strategies/   # Estratégias de gráficos
├── repositories/    # Acesso a dados
├── routes/          # Definição de rotas
├── schemas/         # Validação com Zod
├── utils/           # Utilitários
└── test/            # Testes
```

### Padrões Utilizados
- **Strategy Pattern** - Para diferentes tipos de gráficos
- **Repository Pattern** - Para acesso a dados
- **Factory Pattern** - Para criação de estratégias
- **Middleware Pattern** - Para funcionalidades transversais

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

### Estrutura de Testes
- **Unitários** - Testam componentes isolados
- **Integração** - Testam fluxos completos
- **Cobertura mínima** - 80%

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Compila TypeScript
npm run start            # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Verifica código com ESLint
npm run lint:fix         # Corrige problemas do ESLint
npm run format           # Formata código com Prettier

# Testes
npm test                 # Executa todos os testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Executa testes com cobertura

# Banco de Dados
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate   # Executa migrações
npm run prisma:seed      # Popula banco com dados
npm run prisma:studio    # Abre Prisma Studio

# Docker
npm run docker:up        # Inicia containers
npm run docker:down      # Para containers
npm run docker:build     # Constrói e inicia containers
```

## 🐳 Docker

## 🪟 WSL / Ubuntu — Instalar Docker (passo-a-passo)

Se você usa Windows e prefere rodar containers dentro do WSL (Ubuntu), siga estes passos. Eles se baseiam nas instruções mínimas que você forneceu e incluem observações para evitar problemas comuns com permissões e reinício.

1) Instalar WSL com Ubuntu (PowerShell como Administrador)

```powershell
# Instala o WSL e a distribuição Ubuntu
wsl --install -d Ubuntu

# (Opcional) Define o WSL2 como padrão
wsl --set-default-version 2
```

2) Abra o Ubuntu (via app WSL) e atualize pacotes

```bash
sudo apt update && sudo apt upgrade -y
```

3) Instalar Docker e Docker Compose

```bash
# Instala o motor Docker
sudo apt install -y docker.io

# Instala o docker-compose (ou use o plugin moderno se preferir)
sudo apt install -y docker-compose
```

4) Iniciar o serviço Docker e adicionar seu usuário ao grupo "docker"

```bash
# Inicia o serviço (em algumas imagens WSL systemd pode não existir; use `service` se necessário)
sudo systemctl enable --now docker 2>/dev/null || sudo service docker start

# Adiciona o usuário atual ao grupo docker para executar comandos sem sudo
sudo usermod -aG docker $USER
```

Observação: após `usermod -aG docker $USER` você precisa encerrar a sessão WSL e abrir novamente para que a nova associação de grupo tenha efeito. Feche a janela/terminal WSL ou execute `exit` e reabra o Ubuntu. Alternativamente, execute `newgrp docker` na mesma sessão para aplicar a mudança imediatamente.

5) (Opcional) Definir Ubuntu como distribuição padrão do WSL

```powershell
wsl --set-default Ubuntu
```

6) Testar o Docker (no WSL)

```bash
# Verifica se o Docker responde
docker version

# Teste simples — executa a imagem hello-world
docker run hello-world
```

Se ver a mensagem do `hello-world`, o Docker está funcionando corretamente.

7) Dicas e problemas comuns
- Se `docker run` falhar com permissão, confirme que você reabriu a sessão WSL (ou use `newgrp docker`).
- Se `systemctl` não funcionar no WSL (algumas builds não têm systemd), use `sudo service docker start` e verifique logs com `sudo journalctl -u docker --no-pager` (nem todas as distribuições via WSL têm journalctl).
- Para usar `docker-compose` com a sintaxe v2 (`docker compose up`), instale o plugin `docker-compose-plugin` ou use o binário oficial do Compose, se necessário.
- Reinicie o WSL (Windows) com `wsl --shutdown` se algo ficar inconsistente.

8) (Opcional) Executar como ambiente de desenvolvimento

- Recomendo abrir o projeto a partir do WSL (no Ubuntu): navegue até a pasta do projeto em WSL e rode `code .` — assim o VS Code usa a extensão Remote - WSL e evita problemas de permissões/IO entre Windows e WSL.

Segurança: não exponha o daemon Docker publicamente sem proteção; para produção, use autenticação, firewall e práticas recomendadas.


### Subir apenas o serviço MySQL com Docker Compose (exemplo)

Se você quiser subir apenas o serviço MySQL definido no `docker-compose.yml`, use os comandos abaixo (por exemplo, dentro do WSL/Ubuntu ou em um terminal com Docker configurado):

```bash
# Sobe apenas o serviço chamado `mysql` em background
docker compose up mysql -d

# Aguarda alguns segundos para o container inicializar (ajuste se necessário)
sleep 30

# Verifica containers em execução
docker ps
```

Observações úteis:
- Se o nome do serviço no `docker-compose.yml` for diferente de `mysql`, troque pelo nome correto.
- Para ver logs em tempo real: `docker compose logs -f mysql` ou `docker logs -f <container_id>`.
- Após o container do MySQL subir, atualize o `DATABASE_URL` no seu arquivo `.env` e rode as migrações:

```bash
# Exemplo de atualização do .env
# DATABASE_URL="mysql://user:password@127.0.0.1:3306/analytics"

# Executar migrações e seed
npm run prisma:migrate
npm run prisma:seed
```

Se algo der errado, inspecione os logs do container e confirme que as credenciais e a porta no `DATABASE_URL` correspondem ao container MySQL.

## 📋 Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL="mysql://user:password@localhost:3306/analytics"

# Logging
LOG_LEVEL=info
```
