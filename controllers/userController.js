// const mongoose = require('mongoose');
const http2 = require('http2');
const User = require('../models/user');

// Получение всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
    }

    // Продолжаем разбор JSON только если данные не пусты
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: users });
  } catch (err) {
    console.error('Error in getAllUsers:', err);
    res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }
  // Вернуть какое-то значение (например, Promise.resolve()), чтобы удовлетворить линтер
  return Promise.resolve();
};

// Получение пользователя по ID
exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail(
      new Error('Пользователь не найден'),
    );
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: user });
  } catch (err) {
    if (err.message === 'Пользователь не найден') {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат ID' });
    }
    return res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return null;
};

// Создание нового пользователя
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ data: newUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return null;
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).orFail(new Error('Запрашиваемый пользователь не найден'));
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: updatedUser });
  } catch (err) {
    if (err.message === 'Запрашиваемый пользователь не найден') {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат данных или ID пользователя' });
    }
    res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return null;
};

// Обновление аватара пользователя
exports.updateAvatar = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).orFail(new Error('Запрашиваемый пользователь не найден'));
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: updatedUser });
  } catch (err) {
    if (err.message === 'Запрашиваемый пользователь не найден') {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат данных или ID пользователя' });
    }
    res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }

  return null;
};
