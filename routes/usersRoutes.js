const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')


router.get('/register', UserController.register)
router.post('/register', UserController.registerPost)



module.exports = router