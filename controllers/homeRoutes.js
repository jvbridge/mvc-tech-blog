const router = require("express").Router();
const { User, Posts, Comments } = require("../models");
const withAuth = require("../util/auth");

router.get("/", async (req, res) => {
  try {
    res.render("homepage", { loggedIn: req.session.loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/");
      return;
    }
    res.render("login");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", withAuth, async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users", withAuth, async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]],
    });

    const users = userData.map((user) => user.get({ plain: true }));
    res.render("users", { loggedIn: req.session.loggedIn, users });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;

router.get("/users/:username", withAuth, async (req, res) => {
  try {
    const userData = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { username: req.params.username },
    });

    if (!userData) {
      res.status(404).json({ message: "user not found!" });
      return;
    }

    const postData = await Posts.findAll({
      where: { user_id: userData.id },
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("userpage", { loggedIn: req.session.loggedIn, posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/posts", withAuth, async (req, res) => {
  try {
    // get all posts
    const postData = await Posts.findAll({
      include: [{ model: User, required: true }],
    });
    if (!postData) {
      res.status(404).json({ message: "no posts yet" });
      return;
    }

    // serialize them
    const posts = postData.map((post) => post.get({ plain: true }));

    // send them through the rendering engine
    res.render("posts", { loggedIn: req.session.loggedIn, posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    // get the post in question
    const postData = await Posts.findOne({
      where: { id: req.params.id },
      include: [{ model: User, required: true }],
    });

    // No post? 404 error
    if (!postData) {
      res.status(404).json({ message: "post not found" });
      return;
    }

    // get all comments
    const commentData = await Comments.findAll({
      where: { post_id: req.params.id },
      include: [{ model: User, required: true }],
    });

    // serealize the post
    const post = postData.get({ plain: true });
    const comments = commentData.map((comment) => {
      return comment.get({ plain: true });
    });

    res.render("post", { loggedIn: req.session.loggedIn, post, comments });
  } catch (err) {
    res.status(500).json(err);
  }
});
