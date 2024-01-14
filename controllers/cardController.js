const mongoose = require('mongoose');
const http2 = require('http2');
const Card = require('../models/card');
const BadRequestError = require('../utils/BadRequestError');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenErrors');

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(http2.constants.HTTP_STATUS_OK).json({ data: cards });
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(http2.constants.HTTP_STATUS_CREATED).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    }
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return next(new BadRequestError('Некорректный ID карточки'));
  }

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    if (card.owner.toString() !== req.user._id.toString()) {
      return next(
        new ForbiddenError('Недостаточно прав для удаления этой карточки'),
      );
    }

    await Card.deleteOne({ _id: cardId });
    res
      .status(http2.constants.HTTP_STATUS_OK)
      .send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return next(new BadRequestError('Некорректный ID карточки'));
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return next(new BadRequestError('Некорректный ID карточки'));
  }

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка не найдена'));
    }

    res.status(http2.constants.HTTP_STATUS_OK).json(card);
  } catch (err) {
    next(err);
  }
};
