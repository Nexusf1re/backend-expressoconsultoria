# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Adicionado
- API RESTful dinâmica para dados de gráficos
- Suporte a múltiplos tipos de gráfico: pie, line, bar, area
- Validação rigorosa com Zod
- Arquitetura em camadas com Strategy Pattern
- Testes unitários e de integração com Vitest
- Documentação OpenAPI/Swagger
- Docker e docker-compose para desenvolvimento
- Logging estruturado com Pino
- TypeScript strict mode
- Scripts de setup automatizado
- Cobertura de testes ≥ 80%
- Middleware de tratamento de erros
- Health check endpoint
- Suporte a diferentes métricas: sum, avg, count
- Agrupamento por diferentes dimensões
- Filtros de data obrigatórios
- Limitação de resultados
- Ordenação de dados
- Suporte a séries divididas para gráficos de área

### Técnico
- Node.js 18+ com TypeScript
- Express.js para servidor HTTP
- Prisma ORM com MySQL
- Vitest para testes
- ESLint + Prettier para qualidade de código
- Docker para containerização
- Pino para logging
- Zod para validação
- Swagger UI para documentação

### Estrutura
- Controllers para requisições HTTP
- Services para lógica de negócio
- Repositories para acesso a dados
- Strategies para diferentes tipos de gráfico
- Middlewares para validação e logging
- Schemas para validação de dados
- Utils para funções auxiliares

### Banco de Dados
- Tabela `sales` com índices otimizados
- Seeds com 5000 registros de teste
- Migrações automáticas
- Suporte a SQLite para testes

### Docker
- Dockerfile otimizado para produção
- docker-compose.yml com MySQL e app
- Health checks para containers
- Volumes para persistência de dados

### Testes
- Testes unitários para strategies e utils
- Testes de integração para controllers
- Cobertura de código com relatórios
- Mocks para dependências externas
- Setup automatizado para testes

### Documentação
- README completo com instruções
- Contributing guidelines
- Changelog detalhado
- Documentação da API com Swagger
- Exemplos de uso para todos os endpoints

### Scripts
- Setup automatizado para desenvolvimento
- Scripts de build e deploy
- Scripts de teste e cobertura
- Scripts de banco de dados
- Scripts de Docker

---

## Como Contribuir

Para adicionar uma nova entrada ao changelog:

1. **Adicionado**: para novas funcionalidades
2. **Alterado**: para mudanças em funcionalidades existentes
3. **Deprecado**: para funcionalidades que serão removidas
4. **Removido**: para funcionalidades removidas
5. **Corrigido**: para correções de bugs
6. **Segurança**: para vulnerabilidades corrigidas

### Exemplo de Entrada

```markdown
### Adicionado
- Nova funcionalidade X que permite Y
- Suporte a novo tipo de gráfico Z

### Corrigido
- Bug na validação de datas
- Erro de performance em queries grandes

### Alterado
- Melhorada performance do endpoint /charts/pie
- Atualizada documentação da API
```
