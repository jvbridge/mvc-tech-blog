const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Comments = require("./comments");

class Posts extends Model {
  createComment(user_id, body) {
    return Comments.create({
      user_id,
      body,
      post_id: this.id,
    });
  }
}

Posts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: "posts",
  }
);

module.exports = Posts;
