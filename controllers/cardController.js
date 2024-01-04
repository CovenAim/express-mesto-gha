const http2 = require('http2');
const Card = require('../models/card');

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: cards });
  } catch (err) {
    res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(http2.constants.HTTP_STATUS_CREATED).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    } else {
      res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    }
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }

    await Card.deleteOne({ _id: cardId });
    return res
      .status(http2.constants.HTTP_STATUS_OK)
      .send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат ID карточки' });
    }
    console.error('Ошибка при удалении карточки:', err);
    return res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

exports.likeCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }

    return res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат ID карточки' });
    }
    return res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res
        .status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка не найдена' });
    }

    return res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res
        .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный формат ID карточки' });
    }
    return res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
