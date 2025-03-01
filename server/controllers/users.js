
const { User } = require('../models');

// hypermedia
// to auction, to bids, to items?

const getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  })
  if (users.length === 0) {
    return res.status(204).end();
  }
  return res.json(users);
};

module.exports = {
  getUsers
};
