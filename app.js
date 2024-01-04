const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rootRouter = require('./routes/index');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;
const HTTP_NOT_FOUND = 404;

// Используем helmet
app.use(helmet());

// Определение запросов лимитера
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

// Подключение к MongoDB
mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Подключение установлено');
  })
  .catch((err) => {
    console.error('Ошибка подключения:', err.message);
  });

app.use(express.json());

// Добавляем лимитер
app.use(limiter);

app.use((req, res, next) => {
  req.user = {
    _id: '656f3a96e42bc2e806180894',
  };

  next();
});

// rootRouter
app.use('/', rootRouter);

// Обработка случая, когда маршрут не найден
app.use((req, res) => {
  res.status(HTTP_NOT_FOUND).json({ message: 'Страница не найдена' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
