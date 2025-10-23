@echo off
echo Configurando banco de dados de teste...

REM Verificar se o MySQL está rodando
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL não está instalado ou não está no PATH
    echo Tentando usar Docker...
    
    REM Verificar se Docker está disponível
    docker --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo Docker não está disponível
        echo Por favor, instale o MySQL ou Docker
        exit /b 1
    )
    
    echo Iniciando MySQL com Docker...
    docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=analytics_test -p 3306:3306 -d mysql:8.0
    
    echo Aguardando MySQL inicializar...
    timeout /t 10 /nobreak >nul
    
    echo Criando banco de dados de teste...
    docker exec mysql-test mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS analytics_test;"
    
    echo Banco de dados de teste criado com sucesso!
    echo Para parar o MySQL: docker stop mysql-test && docker rm mysql-test
    exit /b 0
)

REM Executar script SQL para criar banco de teste
echo Criando banco de dados de teste...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS analytics_test;"

if %errorlevel% equ 0 (
    echo Banco de dados de teste criado com sucesso!
    echo Você pode agora executar: npm test
) else (
    echo Erro ao criar banco de dados de teste
    echo Verifique se o MySQL está rodando e as credenciais estão corretas
)
