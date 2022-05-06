const router = require("express").Router();

// user and log in
const userRoutes = require("./user-routes");
router.use("/users", userRoutes);

module.exports = router;
