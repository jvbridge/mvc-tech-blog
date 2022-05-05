const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// initialize sequelize
const SequelizeStore = require("connect-session-sequelize")(session.Store);
