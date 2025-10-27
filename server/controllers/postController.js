const Post = require('../models/Post');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find()
      .populate('category')
      .populate('author', 'username')
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('author', 'username');
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(post);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    next(error);
  }
};

// Get comments for a post
exports.getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user', 'username');
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json(post.comments);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    next(error);
  }
};

// Add a comment to a post
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      const error = new Error('Content is required');
      error.statusCode = 400;
      return next(error);
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    post.comments.push({ user: req.user.id, content });
    await post.save();
    // populate the latest comment's user before returning
    const latestComment = post.comments[post.comments.length - 1];
    await latestComment.populate('user', 'username');
    res.status(201).json(latestComment);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  try {
    const post = new Post({
      ...req.body,
      author: req.user.id,
      image: req.file ? req.file.filename : undefined,
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 400;
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    if (post.author.toString() !== req.user.id) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      return next(error);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: req.file ? req.file.filename : post.image },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 400;
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    if (post.author.toString() !== req.user.id) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      return next(error);
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = 500;
    next(error);
  }
};
