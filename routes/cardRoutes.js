const express = require('express');

const cardController = require('../controllers/cardController');

const router = express.Router();

router.get('/', cardController.getCards);
router.post('/', cardController.createCard);
router.delete('/:cardId', cardController.deleteCard);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);

module.exports = router;
