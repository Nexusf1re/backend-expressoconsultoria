# Contributing to Analytics API

Obrigado por considerar contribuir para o Analytics API! Este documento fornece diretrizes para contribuições.

## 🚀 Quick Start

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU_USUARIO/backend-expressoconsultoria.git`
3. **Instale** dependências: `npm install`
4. **Configure** o ambiente: `npm run setup`
5. **Execute** migrações: `npm run prisma:migrate`
6. **Popule** dados: `npm run prisma:seed`
7. **Inicie** desenvolvimento: `npm run dev`

## 📋 Processo de Contribuição

### 1. Criar uma Branch
```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

### 2. Desenvolver
- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de testes ≥ 80%
- Documente mudanças significativas

### 3. Testar
```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm run test:coverage

# Verificar qualidade do código
npm run lint
npm run format
```

### 4. Commit
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

**Convenção de Commits:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

### 5. Push e Pull Request
```bash
git push origin feature/nova-funcionalidade
```

Crie um Pull Request com:
- Descrição clara das mudanças
- Referência a issues relacionadas
- Screenshots (se aplicável)
- Checklist de verificação

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── config/          # Configurações
├── controllers/     # Controladores HTTP
├── middlewares/     # Middlewares
├── modules/         # Módulos de negócio
│   └── charts/      # Módulo de gráficos
├── repositories/    # Acesso a dados
├── routes/          # Definição de rotas
├── schemas/         # Validação (Zod)
├── utils/           # Utilitários
└── test/            # Testes
```

### Padrões de Código

#### TypeScript
- Use `strict: true`
- Prefira interfaces sobre types quando possível
- Use enums para valores constantes
- Evite `any`, use `unknown` quando necessário

#### Naming Conventions
- **Classes**: PascalCase (`ChartService`)
- **Interfaces**: PascalCase com prefixo I (`IChartStrategy`)
- **Funções/Variáveis**: camelCase (`getChartData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_LIMIT`)
- **Arquivos**: kebab-case (`chart-service.ts`)

#### Estrutura de Arquivos
```typescript
// 1. Imports externos
import express from 'express';

// 2. Imports internos
import { ChartService } from '@/services/chart.service';

// 3. Interfaces/Types
interface ChartResponse {
  data: unknown[];
}

// 4. Implementação
export class ChartController {
  // ...
}
```

## 🧪 Testes

### Estrutura de Testes
```
src/test/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── utils/          # Utilitários de teste
└── setup.ts        # Configuração global
```

### Escrevendo Testes

#### Teste Unitário
```typescript
describe('ChartService', () => {
  it('should return chart data', async () => {
    // Arrange
    const mockData = [{ label: 'Test', value: 100 }];
    const mockRepository = { getData: vi.fn().mockResolvedValue(mockData) };
    const service = new ChartService(mockRepository);

    // Act
    const result = await service.getChartData(query);

    // Assert
    expect(result).toEqual(mockData);
    expect(mockRepository.getData).toHaveBeenCalledWith(query);
  });
});
```

#### Teste de Integração
```typescript
describe('ChartController Integration', () => {
  it('should return 200 for valid request', async () => {
    const response = await request(app)
      .get('/charts/pie')
      .query({ startDate: '2024-01-01', endDate: '2024-01-31' })
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });
});
```

### Cobertura de Testes
- **Mínimo**: 80% statements/branches
- **Meta**: 90% statements/branches
- **Foco**: Services e Controllers

## 📝 Documentação

### Código
```typescript
/**
 * Calcula dados para gráfico de pizza
 * @param query - Parâmetros da consulta
 * @returns Dados formatados para gráfico
 */
async getPieData(query: ChartQuery): Promise<PieDataPoint[]> {
  // ...
}
```

### API
- Use JSDoc para documentar endpoints
- Mantenha exemplos atualizados
- Documente códigos de erro

### README
- Mantenha instruções atualizadas
- Adicione exemplos de uso
- Documente decisões arquiteturais

## 🔍 Code Review

### Checklist para Reviewers
- [ ] Código segue padrões estabelecidos
- [ ] Testes cobrem funcionalidade
- [ ] Documentação está atualizada
- [ ] Performance não foi degradada
- [ ] Segurança foi considerada
- [ ] Compatibilidade com versões anteriores

### Checklist para Authors
- [ ] Testes passam (`npm test`)
- [ ] Lint passa (`npm run lint`)
- [ ] Cobertura ≥ 80% (`npm run test:coverage`)
- [ ] Documentação atualizada
- [ ] Commits seguem convenção
- [ ] PR tem descrição clara

## 🐛 Reportando Bugs

### Template de Bug Report
```markdown
**Descrição**
Descrição clara do problema.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja erro

**Comportamento Esperado**
O que deveria acontecer.

**Comportamento Atual**
O que está acontecendo.

**Ambiente**
- OS: [e.g. Windows 10]
- Node: [e.g. 18.17.0]
- Versão: [e.g. 1.0.0]

**Logs**
```
Logs relevantes aqui
```
```

## ✨ Sugerindo Features

### Template de Feature Request
```markdown
**Problema**
Que problema esta feature resolve?

**Solução Proposta**
Descrição da solução.

**Alternativas Consideradas**
Outras soluções consideradas.

**Contexto Adicional**
Qualquer contexto adicional.
```

## 📋 Checklist de Release

### Antes de Fazer Release
- [ ] Todos os testes passam
- [ ] Cobertura ≥ 80%
- [ ] Lint sem erros
- [ ] Documentação atualizada
- [ ] CHANGELOG atualizado
- [ ] Version bumpado
- [ ] Testado em ambiente de produção

### Versioning
Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: mudanças incompatíveis
- **MINOR**: funcionalidades compatíveis
- **PATCH**: correções compatíveis

## 🤝 Comunidade

### Canais de Comunicação
- **Issues**: Para bugs e features
- **Discussions**: Para dúvidas e ideias
- **Pull Requests**: Para contribuições

### Código de Conduta
- Seja respeitoso
- Seja construtivo
- Seja paciente
- Seja colaborativo

## 📚 Recursos Adicionais

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [Zod Documentation](https://zod.dev/)

---

Obrigado por contribuir! 🎉
