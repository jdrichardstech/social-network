const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const { User, Post, Profile } = require('../../models');

// @route POST api/posts
// @desc Post notes from users
// @access Private Route Token Needed

router.post(
  '/',

  [
    auth,
    [
      check('text', 'A post is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      let post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/posts
// @desc Get notes from users
// @access Private Route Token Needed

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route GET api/posts/:id
// @desc Get post by ID
// @access Private Route Token Needed

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE api/posts/:id
// @desc Delete post by ID
// @access Private Route Token Needed

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check user  ** Warning post.user is not a string and must be converted
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    // Check if post exists
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Delete post
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private Route Token Needed

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post has been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    )
      return res.status(400).json({ msg: 'Post already liked' });

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT api/posts/unlike/:id
// @desc Like a post
// @access Private Route Token Needed

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if post has been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    )
      return res.status(400).json({ msg: 'Post has not yet been liked' });

    //Find the index of the post
    const findIndexOfPost = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(findIndexOfPost, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/posts/comment/:id
// @desc Add Comment to Post
// @access Private Route Token Needed

router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'A comment is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc DELETE Comment to Post
// @access Private Route Token Needed

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      comment => comment.id == req.params.comment_id
    );

    // Does comment exist
    if (!comment)
      return res.status(404).json({ msg: 'Comment does not exist' });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Unauthorized' });
    }

    //Get remove index

    const removeIndex = post.comments.map(comment => {
      comment.user.toString().indexOf(req.user.id);
    });

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
