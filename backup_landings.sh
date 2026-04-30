#!/bin/bash
urls=(
  "https://propiedadesenchiapas.com/cuauhtli-terrenos-en-venta-en-el-jobo/"
  "https://propiedadesenchiapas.com/el-higo-copoya-terrenos-10x20-en-copoya/"
  "https://propiedadesenchiapas.com/fraccionamiento-montecristo/"
  "https://propiedadesenchiapas.com/carmen-jimenez-asesor-inmobiliario-de-ibr/"
  "https://propiedadesenchiapas.com/luis-garcia-asesor-inmobiliario-de-ibr/"
  "https://propiedadesenchiapas.com/lupyta-mendoza-asesor-inmobiliario-ibr/"
  "https://propiedadesenchiapas.com/la-canada-desarrollo-eco-campestre/"
  "https://propiedadesenchiapas.com/la-sima-park-terrenos-en-ocozocoautla/"
  "https://propiedadesenchiapas.com/monte-de-los-olivos/"
  "https://propiedadesenchiapas.com/quinta-en-berriozabal/"
  "https://propiedadesenchiapas.com/sima-park/"
)

for url in "${urls[@]}"; do
  dir=$(echo "$url" | awk -F/ '{print $(NF-1)}')
  echo "Descargando $dir..."
  npx -y website-scraper-cli "$url" --directory "./landings_backup/$dir"
done
echo "¡TODAS LAS LANDINGS RESPALDADAS!"
