const Post = require("../models/postModels");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: "SUCCESS",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.getOnePost = async (req, res, nex) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      status: "SUCCESS",
      data: {
        post,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.createPost = async (req, res, nex) => {
  try {
    const post = await Post.create(req.body);
    res.status(200).json({
      status: "SUCCESS",
      data: {
        post,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.updatePost = async (req, res, nex) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "SUCCESS",
      data: {
        post,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.deletePost = async (req, res, nex) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "SUCCESS",
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};
