# Makefile para sponsorcast-cli

.PHONY: install dev test clean

# Variables
NODE_BIN = ./node_modules/.bin
PORT = 3000

# Instalar dependencias
install:
	@echo "Instalando dependencias..."
	npm install
	@echo "\nInstalación completada."

# Ejecutar pruebas
test:
	@echo "Ejecutando pruebas..."
	npm test

# Limpiar dependencias y archivos generados
clean:
	@echo "Limpiando proyecto..."
	rm -rf node_modules output
	@echo "Proyecto limpio."

# Ayuda
help:
	@echo "Opciones disponibles:"
	@echo "  make install    - Instala todas las dependencias"
	@echo "  make test       - Ejecuta las pruebas"
	@echo "  make clean      - Limpia el proyecto"
	@echo "  make help       - Muestra esta ayuda"