const router = require('express').Router();
const userController = require('../controllers/user');
const usersController = require('../controllers/users');
const itemController = require('../controllers/item');
const itemsController = require('../controllers/items');
const categoryController = require('../controllers/category');
const auctionController = require('../controllers/auction');
const auctionsController = require('../controllers/auctions');
const bidController = require('../controllers/bid');
const bidsController = require('../controllers/bids');
const authenticationController = require('../controllers/authentication');
const middleware = require('../utils/middleware');

router.post('/login/:user_id', authenticationController.login);

router.get('/users', usersController.getUsers);

router.get('/user/:user_id', userController.getUser);
router.post('/user/', userController.addUser);
router.put('/user/:user_id', userController.updateUser);
router.delete('/user/:user_id', userController.deleteUser);

router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.addCategories);
router.delete('/categories/:id', categoryController.deleteCategories);

router.get('/items', itemsController.getItems);

router.get('/item/:id', itemController.getItem);
router.post('/item/', itemController.addItem);
router.put('/item/:id', itemController.updateItem);
router.delete('/item/:id', itemController.deleteItem);

router.get('/bids', bidsController.getBids);
router.delete('/bids', bidsController.deleteBids);

router.get('/bid/:bid_id', bidController.getBid);
router.post('/bid', middleware.authenticateJWT, bidController.addBid);
router.delete('/bid/:bid_id', bidController.deleteBid);

// Auction routes
router.get('/auctions', auctionsController.getAuctions); // List all auctions
router.get('/auction/:id', auctionController.getAuctionById); // Get specific auction
router.post('/auction', middleware.authenticateJWT, auctionController.addAuction); // Create new auction
router.delete('/auction/:id', middleware.authenticateJWT, auctionController.deleteAuction); // Delete auction
router.delete('/auctions', middleware.authenticateJWT, auctionsController.deleteAuctions); // Delete all auctions

module.exports = router;
