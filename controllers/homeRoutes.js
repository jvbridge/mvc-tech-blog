const router = require("express").Router();
const { User } = require("../models");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["username", "ASC"]],
    });

    const users = userData.map((user) => user.get({ plain: true }));
    console.log("Rendering: ", users);
    res.render("homepage", { users });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
