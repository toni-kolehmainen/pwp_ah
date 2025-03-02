const { User } = require("../models");

// hypermedia
// to auction, to bids, to items?

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const getUsers = async (req, res) => {
  const cacheKey = "users";
  const cachedUsers = myCache.get(cacheKey);
  if (cachedUsers) {
    return res.json(cachedUsers);
  }
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (users.length === 0) {
    return res.status(204).end();
  }
  myCache.set(cacheKey, users);
  return res.json(users);
};

module.exports = {
  getUsers,
};
