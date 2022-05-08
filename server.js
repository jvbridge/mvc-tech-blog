const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// initialize sequelize
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const routes = require("./controllers/index");
const sequelize = require("./config/connection");
// TODO: const helpers = require("./utils/helpers");

// importing helpers

// app setup
const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create();

const sess = {
  secret: "Secret string here",

  cookie: {
    maxAge: 86400, // 24 hours
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },

  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Middleware

// setting up express sessions
app.use(session(sess));

// handlebars engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// router set up
app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
  });
});
