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

### Usando Docker Compose
```bash
# Iniciar todos os serviços
npm run docker:up

# Parar todos os serviços
npm run docker:down

# Reconstruir e iniciar
npm run docker:build
```

### Arquivos Docker
- `Dockerfile` - Imagem da aplicação
- `docker-compose.yml` - Orquestração dos serviços
- `mysql-init/` - Scripts de inicialização do MySQL

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
