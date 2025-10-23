@echo off
echo Configurando ambiente de teste...

REM Criar arquivo .env se não existir
if not exist .env (
    copy env.example .env
    echo Arquivo .env criado a partir do env.example
)

REM Definir variáveis de ambiente para teste
set DATABASE_URL=mysql://root:root@localhost:3306/analytics_test
set NODE_ENV=test
set LOG_LEVEL=error

echo Ambiente de teste configurado!
echo DATABASE_URL=%DATABASE_URL%
echo NODE_ENV=%NODE_ENV%
echo LOG_LEVEL=%LOG_LEVEL%

echo.
echo Para executar os testes, use: npm test
