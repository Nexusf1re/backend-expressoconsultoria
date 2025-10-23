#!/bin/bash

echo "Configurando banco de dados de teste..."

# Verificar se o MySQL está rodando
if ! command -v mysql &> /dev/null; then
    echo "MySQL não está instalado ou não está no PATH"
    echo "Por favor, instale o MySQL ou adicione ao PATH"
    exit 1
fi

# Executar script SQL para criar banco de teste
mysql -u root -p < scripts/create-test-db.sql

if [ $? -eq 0 ]; then
    echo "Banco de dados de teste criado com sucesso!"
    echo "Você pode agora executar: npm test"
else
    echo "Erro ao criar banco de dados de teste"
    echo "Verifique se o MySQL está rodando e as credenciais estão corretas"
fi
