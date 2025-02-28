const { User } = require('../models');

// hypermedia
// to auction, to bids, to items?

const getUsers = async (req, res) => {
  const users = await User.findAll();
  if (!users) {
    return res.status(204).end();
  }
  return res.json(users);
};

module.exports = {
  getUsers
};
