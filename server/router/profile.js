const router = require('express').Router();

// imported controllers contain the logic for handling requests
const profileController = require('../controllers/profile');

// Profile routes
router.get('/users', profileController.userPofile);
router.get('/items', profileController.itemPofile);
router.get('/categories', profileController.categoryPofile);
router.get('/bids', profileController.bidPofile);
router.get('/auctions', profileController.auctionPofile);

module.exports = router;
