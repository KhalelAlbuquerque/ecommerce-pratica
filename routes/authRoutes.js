const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const authChecker = require('../helpers/AuthChecker').checkAuth


//it blockes the user to access if he is already logged in
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)

//it blockes the user to access if he is already logged in
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)

router.get('/logout', AuthController.logout)


module.exports = router
