const userController = require('../controllers/user_controller')
const itemController = require('../controllers/item_controller')

const router = require('express').Router()
router.get('/test', userController.getTest)
router.get('/users', userController.getUsers)
router.post('/adduser', userController.addUser)
router.get('/users/:id', userController.getUser)
router.get('/items', itemController.getItems)
router.post('/additem', itemController.addItem)
router.post('/items/:id/bid', itemController.placeBid)
module.exports = router