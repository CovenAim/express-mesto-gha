const express = require('express');
const userRouter = require('./userRoutes');
const cardRouter = require('./cardRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
