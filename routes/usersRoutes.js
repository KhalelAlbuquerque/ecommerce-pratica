const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { checkAuth } = require('../helpers/AuthChecker')


// router.get('/:id', UserController.viewUser)

router.get('/dashboard', checkAuth, UserController.viewDashboard)



module.exports = router