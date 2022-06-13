const sequelize = require("../config/connection");
const { User, Posts } = require("../models");

const names = require("./names.json");
const websites = requrie("./websites");

const postData = require("./post-data.json");

const MAX_COMMENTS = 7;
const USER_COUNT = 20;
const DEFAULT_PASSWORD = "password";

/**
 * Returns a random member from a given array
 * @param {Array} arr
 * @returns
 */
const chooseRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Creates a random user that is unique to the dictionary
 * @param {Object} dict dictionary of usernames and passwords
 * @returns {Object[]}
 */
const createRandomUser = (dict) => {
  const firstName = chooseRandom(names);
  const lastName = chooseRandom(names);
  const password = DEFAULT_PASSWORD;
  const email = firstName + "@" + chooseRandom(websites);

  const username = firstName[0] + lastName;
  if (dict[username] || dict[email]) {
    return createRandomUser(dict);
  }

  dict[username] = true;
  dict[email] = true;

  return { username, email, password };
};

const createUsers = (userCount) => {
  const dict = {};
  ret = [];
  for (let i = 0; i < userCount; i++) {
    ret.push(createRandomUser(dict));
  }
};

const seedDatabase = async () => {
  // sync up with the database
  await sequelize.sync({ force: true });
  const userData = createUsers(USER_COUNT);
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
