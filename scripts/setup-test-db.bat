@echo off
echo Configurando banco de dados de teste...

REM Verificar se o MySQL está rodando
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL não está instalado ou não está no PATH
    echo Por favor, instale o MySQL ou adicione ao PATH
    exit /b 1
)

REM Executar script SQL para criar banco de teste
mysql -u root -p < scripts/create-test-db.sql

if %errorlevel% equ 0 (
    echo Banco de dados de teste criado com sucesso!
    echo Você pode agora executar: npm test
) else (
    echo Erro ao criar banco de dados de teste
    echo Verifique se o MySQL está rodando e as credenciais estão corretas
)
