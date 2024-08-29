# Используем официальный образ Node.js в качестве базового
FROM node:16.16.0 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Строим приложение
RUN npm run build

# Используем официальный образ Nginx для развертывания
FROM nginx:alpine

# Копируем сгенерированные файлы из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
