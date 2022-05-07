const router = require("express").Router();
const { User } = require("../../models");

// CREATE a new user
router.post("/", async (req, res) => {
  try {
    // create the database entry
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // automatically log in the user when they are first created.
    req.session.save(() => {
      // boolean for if we are logged in
      req.session.loggedIn = true;
      // user id to tag them
      req.session.userId = dbUserData.id;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// log in route for existing users
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({ where: { email: req.body.email } });

    // Check if a user exists
    if (!dbUserData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password! Try again" });
      return;
    }

    // validate password with extended model method
    const passwordValid = await dbUserData.checkPassword(req.body.password);

    if (!passwordValid) {
      res
        .status(400)
        .json({ message: "Incorrect email or password! Try again" });
      return;
    }

    // we have a valid user, lets save that session data
    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
