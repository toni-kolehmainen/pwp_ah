const router = require('express').Router();

// imported controllers contain the logic for handling requests
const profileController = require('../controllers/profile');
const { resourceProperties } = require('../static/profiles');

// Profile routes
router.get('/users', profileController.userPofile);
router.get('/items', profileController.itemPofile);
router.get('/categories', profileController.categoryPofile);
router.get('/bids', profileController.bidPofile);
router.get('/auctions', profileController.auctionPofile);

router.all('*', (req, res) => {
  res.status(404).json(resourceProperties());
});
module.exports = router;
