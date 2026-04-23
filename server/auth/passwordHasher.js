//passwordHasher.js file to hash passwords using the bcrypt library
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; //number of rounds to hash the password

//call hashPassword when creating or updating user passwords
async function hashPassword(plainTextPassword) {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

//export the hashPassword
module.exports = {
  hashPassword,
};
