# Analytics API

API RESTful para geração dinâmica de dados de gráficos com Node.js, TypeScript, Express e Prisma.

## 🛠️ Stack Tecnológica

### **Backend**
- **Node.js** >= 18.0.0 - Runtime JavaScript
- **TypeScript** - Linguagem tipada
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** 8.0+ - Banco de dados relacional

### **Desenvolvimento**
- **Vitest** - Framework de testes
- **ESLint** - Linter de código
- **Prettier** - Formatador de código
- **Docker** - Containerização
- **Zod** - Validação de schemas

### **Ferramentas**
- **Swagger** - Documentação da API
- **Pino** - Logger estruturado
- **Helmet** - Segurança HTTP
- **CORS** - Cross-origin resource sharing

## 📋 Índice

- [Início Rápido](#-início-rápido)
- [Funcionalidades](#-funcionalidades)
- [Endpoints da API](#-endpoints-da-api)
- [Códigos de Retorno](#-códigos-de-retorno)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Arquitetura](#️-arquitetura)
- [Testes](#-testes)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Configuração](#-configuração)

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

## 📋 Códigos de Retorno

### Health Check (`GET /health`)

#### ✅ 200 OK - Aplicação Saudável
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "database": "connected"
}
```

#### ❌ 503 Service Unavailable - Problemas de Conectividade
```json
{
  "status": "error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "database": "disconnected"
}
```

### Gráficos (`GET /charts/{type}`)

#### ✅ 200 OK - Dados Gerados com Sucesso

**Gráfico de Pizza:**
```json
{
  "type": "pie",
  "data": [
    { "label": "Categoria A", "value": 1500 },
    { "label": "Categoria B", "value": 2300 }
  ]
}
```

**Gráfico de Linha/Área:**
```json
{
  "type": "line",
  "data": {
    "labels": ["2024-01-01", "2024-01-02"],
    "datasets": [
      { "label": "Série 1", "data": [100, 150] }
    ]
  }
}
```

#### ❌ 400 Bad Request - Erros de Validação

**Tipo de Gráfico Inválido:**
```json
{
  "error": {
    "code": "INVALID_CHART_TYPE",
    "message": "Tipo de gráfico inválido",
    "suggestion": "Tipos suportados: pie, line, bar"
  }
}
```

**Formato de Data Inválido:**
```json
{
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "Data de início deve estar no formato YYYY-MM-DD",
    "suggestion": "Use o formato YYYY-MM-DD para as datas"
  }
}
```

**Range de Datas Inválido:**
```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Data de início deve ser anterior à data de fim",
    "suggestion": "Verifique se startDate <= endDate"
  }
}
```

**Período Muito Longo:**
```json
{
  "error": {
    "code": "DATE_RANGE_TOO_LONG",
    "message": "Período não pode exceder 365 dias",
    "suggestion": "Reduza o intervalo de datas"
  }
}
```

**Erro de Validação Geral:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mensagem específica do erro",
    "suggestion": "Verifique os parâmetros fornecidos"
  }
}
```

#### ❌ 422 Unprocessable Entity - Erros de Negócio

**Parâmetros Incompatíveis:**
```json
{
  "error": {
    "code": "INCOMPATIBLE_PARAMETERS",
    "message": "Combinação de parâmetros incompatível: Dimensão é obrigatória para gráficos de pizza",
    "suggestion": "Verifique se os parâmetros são adequados para o tipo de gráfico solicitado"
  }
}
```

#### ❌ 500 Internal Server Error - Erro Interno
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Ocorreu um erro interno no servidor",
    "suggestion": "Tente novamente em alguns instantes ou entre em contato com o suporte"
  }
}
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

#### **Opção 1: Testes Completos (Recomendado)**
```bash
# 1. Configurar banco de dados de teste (primeira vez)
npm run test:setup

# 2. Executar todos os testes (42 testes)
npm test

# 3. Executar com cobertura de código
npm run test:coverage
```

#### **Opção 2: Testes Unitários Apenas**
```bash
# Executa apenas testes unitários (30 testes)
# Funciona sem banco de dados configurado
npm test
```

#### **Desenvolvimento**
```bash
# Executar em modo watch (desenvolvimento)
npm run test:watch
```

### **Quando Usar Cada Opção**

| Cenário | Comando | Resultado |
|---------|---------|-----------|
| **Primeira execução** | `npm run test:setup` + `npm test` | ✅ Todos os 42 testes |
| **Desenvolvimento contínuo** | `npm test` | ✅ 30 testes unitários (sem banco) |
| **CI/CD Pipeline** | `npm run test:setup` + `npm test` | ✅ Todos os 42 testes |
| **Sem MySQL disponível** | `npm test` | ✅ 30 testes unitários |

### Estrutura dos Testes

O sistema possui **42 testes** organizados em:

**Testes Unitários (30 testes)**
- ✅ **Estratégias de Gráficos** - Validações de negócio
- ✅ **Utilitários** - Funções de data e métricas
- ✅ **Factories** - Criação de estratégias
- ✅ **Mocks** - Dados simulados, sem dependência de banco

**Testes de Integração (12 testes)**
- ✅ **Controllers HTTP** - Endpoints completos
- ✅ **Validação de Parâmetros** - Códigos de erro 400/422
- ✅ **Banco de Dados** - Operações reais com `analytics_test`
- ✅ **Health Check** - Status da aplicação

### Cobertura de Testes

**Cobertura Mínima:** 70% (configurável em `vitest.config.ts`)

```bash
# Verificar cobertura
npm run test:coverage

# Relatório HTML gerado em: coverage/index.html
```

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

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL="mysql://user:password@localhost:3306/analytics"

# Logging
LOG_LEVEL=info
```

### Docker Setup

Para desenvolvimento com Docker:

```bash
# Iniciar MySQL
docker-compose up -d mysql

# Aguardar inicialização
sleep 30

# Verificar containers
docker ps
```

**Configuração do Banco:**
```env
DATABASE_URL="mysql://root:root@127.0.0.1:3306/analytics"
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.