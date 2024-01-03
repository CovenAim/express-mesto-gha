const express = require("express");
const mongoose = require("mongoose");
const rootRouter = require("./routes/index");


const app = express();
const PORT = 3000;
const HTTP_NOT_FOUND = 404;

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Подключение установлено");
  })
  .catch((err) => {
    console.error("Ошибка подключения:", err.message);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "656f3a96e42bc2e806180894",
  };

  next();
});

app.use("/", rootRouter);

app.use((req, res) => {
  res.status(HTTP_NOT_FOUND).json({ message: "Страница не найдена" });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
