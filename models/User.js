const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");
const Posts = require("./posts");

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

  createPost(title, body) {
    return Posts.create({
      user_id: this.id,
      title,
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
