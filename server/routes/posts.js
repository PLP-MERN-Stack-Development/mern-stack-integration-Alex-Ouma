const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
], postController.createPost);
router.put('/:id', auth, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
], postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

// Comments routes on posts
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', auth, postController.addComment);

module.exports = router;
