const User = require("./user");
const Posts = require("./posts");
const Comments = require("./comments");

User.hasMany(Posts, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Posts.belongsTo(User, {
  foreignKey: "user_id",
});

Posts.hasMany(Comments, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});

User.hasMany(Comments, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Comments.belongsTo(Posts, {
  foreignKey: "post_id",
});

Comments.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Posts, Comments };
