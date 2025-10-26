const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', auth, [
  body('name').notEmpty().withMessage('Category name is required'),
], categoryController.createCategory);

module.exports = router;
