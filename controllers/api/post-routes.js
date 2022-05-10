const router = require("express").Router();
const { Posts } = require("../../models");

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

module.exports = router;
