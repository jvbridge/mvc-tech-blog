const router = require("express").Router();
const { Posts, Comments } = require("../../models");

router.post("/", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't make a post when not logged in" });
      return;
    }

    if (!req.body.body || req.body.title) {
      res.status(400).json({ message: "missing fields" });
    }

    Posts.create({
      user_id: req.session.userId,
      title: req.body.title,
      body: req.body.body,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // can't delete anything if not logged in
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't delete a post when not logged in" });
      return;
    }

    // finding the post
    const postData = await Posts.findByPk(req.params.id);

    // tell them if we can't find that post
    if (!postData) {
      res.status(404).json({ message: `no post with ID ${req.params.id}` });
      return;
    }

    // can't delete someone else's post
    if (postData.userId != req.session.userId) {
      res
        .status(403)
        .json("User is not permitted to delete someone else's post");
      return;
    }

    // all checks passed, lets get rid of the post
    await postData.destroy();
    res.status(200).json({ message: "Removed the post successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    // can't update anything if not logged in
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't update a post when not logged in" });
      return;
    }

    // checking formatting
    if (!req.body.body || req.body.title) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    // finding the post
    const postData = await Posts.findByPk(req.params.id);

    // tell them if we can't find that post
    if (!postData) {
      res.status(404).json({ message: `no post with ID ${req.params.id}` });
      return;
    }

    // can't update someone else's post
    if (postData.userId != req.session.userId) {
      res.status(403).json("User is not permitted to edit someone else's post");
      return;
    }

    // all checks passed, lets update the post
    await postData.update({
      title: req.body.title,
      body: req.body.title,
    });

    res.status(200).json({ message: "Removed the post successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    // can't update anything if not logged in
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't make a comment when not logged in" });
      return;
    }

    // checking formatting
    if (!req.body.body) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    // finding the post
    const postData = await Posts.findByPk(req.params.id);

    // tell them if we can't find that post
    if (!postData) {
      res.status(404).json({ message: `no post with ID ${req.params.id}` });
      return;
    }

    // all checks passed, lets add the comment
    await postData.createComment(req.session.userId, req.body.body);
    res.status(200).json({ message: "Added the comment successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/comment/:commentId", async (req, res) => {
  try {
    // can't update anything if not logged in
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't update a comment when not logged in" });
      return;
    }

    // checking formatting
    if (!req.body.body) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    // finding the comment
    const commentData = await Comments.findByPk(req.params.id);

    // tell them if we can't find that comment
    if (!commentData) {
      res.status(404).json({ message: `no comment with ID ${req.params.id}` });
      return;
    }

    if (commentData.userId != req.session.userId) {
      res.status(404).json({ message: "can't edit some else's comment" });
    }

    // all checks passed, lets update the comment
    await commentData.update({
      body: req.body.body,
    });
    res.status(200).json({ message: "Updated the comment successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/comment/:commentId", async (req, res) => {
  try {
    // can't update anything if not logged in
    if (!req.session.loggedIn) {
      res
        .status(403)
        .json({ message: "you can't delete a comment when not logged in" });
      return;
    }

    // finding the comment
    const commentData = await Comments.findByPk(req.params.id);

    // tell them if we can't find that comment
    if (!commentData) {
      res.status(404).json({ message: `no comment with ID ${req.params.id}` });
      return;
    }

    if (commentData.userId != req.session.userId) {
      res.status(404).json({ message: "can't delete some else's comment" });
    }

    // all checks passed, lets delete the comment
    await commentData.destroy();
    res.status(200).json({ message: "Deleted the comment successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
