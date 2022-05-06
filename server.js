const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// initialize sequelize
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const routes = require("./contollers");
const sequelize = require("./config/connection");
// TODO: const helpers = require("./utils/helpers");

// importing helpers

// app setup
const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Secret string here",

  cookie: {
    maxAge: 86400, // 24 hours
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
};

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and 
      create an account!`
    );
  });
});
