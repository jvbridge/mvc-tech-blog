const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");
const Posts = require("./posts");
const Comments = require("./comments");

/**
 * User is a table used to store each individual user in the database.
 */
class User extends Model {
  /**
   * This method is used to check the user's password with what is in the
   * database. It returns true if the password is correct, false if not.
   * @param {string} pass - the user's password
   * @returns {boolean}
   */
  checkPassword(pass) {
    return bcrypt.compareSync(pass, this.password);
  }

  /**
   * Creates a post made by this user
   * @param {string} title the title made by the user (max 255 characters)
   * @param {string} body the body of the post made by the suer
   * @returns {Promise}
   */
  createPost(title, body) {
    return Posts.create({
      user_id: this.id,
      title,
      body,
    });
  }

  /**
   * Creates a comment made by the user
   * @param {number} post_id id of the post that this will be appended to
   * @param {string} body the body of the comment made
   * @returns {Promise}
   */
  createCommment(post_id, body) {
    return Comments.create({
      user_id: this.id,
      post_id,
      body,
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6], // minimum password length is 6
      },
    },
  },
  {
    // When we create a new user we hash and salt their password
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

module.exports = User;
