const { Auction } = require('../models');

// GET /auctions: List all auctions

const getAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.findAll({
      attributes: ['id', 'desctription', 'end_time', 'starting_price', 'current_price'],
      order: [['end_time', 'ASC']] // Optional: Order by end_time ascending
    });
    return res.json(auctions);
  } catch (e) {
    const error = new Error(e.message);
    error.name = e.name;
    return next(error);
  }
};

// DELETE /auctions: Delete all auctions

// const deleteAuctions = async (req, res, next) => {
//   try {
//     await Auction.destroy({ truncate: true }); // Truncate the table
//     return res.json({ message: 'All auctions deleted successfully' });
//   } catch (e) {
//     const error = new Error(e.message);
//     error.name = e.name;
//     return next(error);
//   }
// };

module.exports = {
  getAuctions,
  // deleteAuctions,
};