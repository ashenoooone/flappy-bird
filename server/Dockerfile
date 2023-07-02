# Базовый образ для Node.js
FROM node:14

# Установка рабочей директории
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json /app/
RUN npm install

# Копирование кода приложения
COPY . /app/

# Указание порта, который будет прослушивать приложение
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"]
