const router = require("express").Router();

/**
 * This will serve up user facing infomation
 */
const homeRoutes = require("./homeRoutes");
router.use("/", homeRoutes);

/**
 * API is all non user facing queries. They will be used primarily to modify the
 * database
 */
const apiRoutes = require("./api");
router.use("/api", apiRoutes);

module.exports = router;
