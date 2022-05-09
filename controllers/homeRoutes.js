const router = require("express").Router();
const { User } = require("../models");
const withAuth = require("../util/auth");

router.get("/", async (req, res) => {
  try {
    res.render("homepage", { loggedIn: req.session.loggedin });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  try {
    if (req.session.loggedin) {
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
    res.render("users", { loggedin: req.session.loggedin, users });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
