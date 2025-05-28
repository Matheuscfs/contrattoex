#!/bin/bash

# Script para baixar as logos das empresas
# Execute este script na raiz do projeto

# Criar diretório para logos
mkdir -p public/logos

echo "📥 Baixando logos das empresas..."

# Grupo UNUS - Logo azul escuro
echo "🔵 Baixando logo do Grupo UNUS..."
curl -o public/logos/grupo-unus.png "https://via.placeholder.com/200x80/2D3748/FFFFFF?text=GRUPO+UNUS"

# Transdesk - Logo azul e verde
echo "🔷 Baixando logo da Transdesk..."
curl -o public/logos/transdesk.png "https://via.placeholder.com/200x80/1E40AF/FFFFFF?text=TRANSDESK"

# BR Center Truck - Logo amarelo
echo "🟡 Baixando logo da BR Center Truck..."
curl -o public/logos/br-center-truck.png "https://via.placeholder.com/200x80/F59E0B/000000?text=BR+CENTER+TRUCK"

# TDK Seguros - Logo roxo
echo "🟣 Baixando logo da TDK Seguros..."
curl -o public/logos/tdk-seguros.png "https://via.placeholder.com/200x80/7C3AED/FFFFFF?text=TDK+SEGUROS"

# TK - Logo vermelho
echo "🔴 Baixando logo da TK..."
curl -o public/logos/tk.png "https://via.placeholder.com/200x80/DC2626/FFFFFF?text=TK"

echo "✅ Download das logos concluído!"
echo "📁 Logos salvas em: public/logos/"

# Listar arquivos criados
ls -la public/logos/ 