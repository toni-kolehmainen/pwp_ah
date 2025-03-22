const router = require('express').Router();

// imported controllers contain the logic for handling requests
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

// imported middleware contain authentication logic for jwt
const middleware = require('../utils/middleware');

// Authentication routes
router.post('/login/:user_id', authenticationController.login);

// User routes
router.get('/users', usersController.getUsers);
router.post('/users', usersController.addUser);

router.get('/users/:user_id', userController.getUser);

router.put('/users/:user_id', userController.updateUser);
router.delete('/users/:user_id', userController.deleteUser);

// Categories routes
router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.addCategories);
router.delete('/categories/:id', categoryController.deleteCategories);

// Item routes
router.get('/items', itemsController.getItems);
router.post('/items', itemsController.addItem);

router.get('/items/:id', itemController.getItem);
router.put('/items/:id', itemController.updateItem);
router.delete('/items/:id', itemController.deleteItem);

// Bids routes
router.get('/bids', bidsController.getBids);
router.post('/bids', middleware.authenticateJWT, bidsController.addBid);

router.get('/bids/:bid_id', bidController.getBid);
router.delete('/bids/:bid_id', bidController.deleteBid);

// Auction routes
router.get('/auctions', auctionsController.getAuctions); // List all auctions
router.get('/auctions/:id', auctionController.getAuctionById); // Get specific auction
router.post('/auctions', middleware.authenticateJWT, auctionsController.addAuction); // Create new auction
router.delete('/auctions/:id', middleware.authenticateJWT, auctionController.deleteAuction); // Delete auction

module.exports = router;
