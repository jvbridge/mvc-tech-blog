const sequelize = require("../config/connection");
const { User, Posts } = require("../models");

const userData = require("./user-data.json");
const postData = require("./post-data.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const user of users) {
    const postCount = Math.floor(Math.random() * postData.length);
    for (let i = 0; i < postCount; i++) {
      let postIndex = Math.floor(Math.random() * postData.length);
      await user.createPost(
        postData[postIndex].title,
        postData[postIndex].body
      );
    }
  }
  process.exit(0);
};

seedDatabase();
