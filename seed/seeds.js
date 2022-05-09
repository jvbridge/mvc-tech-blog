const sequelize = require("../config/connection");
const { User, Posts } = require("../models");

const userData = require("./user-data.json");
const postData = require("./post-data.json");

MAX_COMMENTS = 7;

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // seeding users
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // seeding posts
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

  // seeding comments
  const posts = await Posts.findAll();

  // every poster makes comments
  for (const post of posts) {
    // random number of comments
    const commentCount = Math.floor(Math.random() * MAX_COMMENTS);
    //
    for (let i = 0; i < commentCount; i++) {
      const commenterIndex = Math.floor(Math.random() * users.length);
      const currUser = users[commenterIndex];
      const commentIndex = Math.floor(Math.random() * postData.length);
      await currUser.createCommment(post.id, postData[commentIndex].body);
    }
  }

  process.exit(0);
};

seedDatabase();
