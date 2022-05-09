const User = require("./user");
const Posts = require("./posts");

User.hasMany(Posts, {
  foreignKey: "user_id",
  onDelete: "cascade",
});

Posts.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Posts };
