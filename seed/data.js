const names = require("./names.json");
const websites = require("./websites.json");

/**
 * Generates an array of unique users that can be inserted into the database.
 * Uniqueness only guaranteed for each call of the function.
 * @param {Number} count how many users to generate
 * @returns {Object[]} an array of unique usernames and emails
 */
const getRandomUsers = (count) => {
  // check to make sure there are enough random users to generate
  if (names.length ** 2 * websites.length < count) {
    throw new Error("cannot make that many unique userss");
  }

  const ret = []; // returning array
  const dict = {}; // hashtable to ensure unique users
  // get a bunch of random users
  for (let i = 0; i < count; i++) {
    ret.push(genUser(dict));
  }
  return ret;
};

/**
 * Helper function that generates a random user with data given
 * @param {Object} dict used to ensure user uniqueness
 * @returns {Object} a user object usable to make a new user
 */
const genUser = (dict) => {
  // make a user from our random data
  const firstName = names[Math.floor(Math.random() * names.length)];
  const lastName = names[Math.floor(Math.random() * names.length)];
  const website = websites[Math.floor(Math.random() * websites.length)];
  const email = firstName.toLowerCase() + "@" + website;
  const username = firstName[0].toLowerCase() + lastName;

  // check to make sure the values are unique
  if (dict[email] || dict[username]) {
    // not unique, try again
    return genUser(dict);
  }
  // they are unique, update our table and return the users
  dict[username] = true;
  dict[email] = true;
  return { username, email };
};

module.exports = { getRandomUsers };
