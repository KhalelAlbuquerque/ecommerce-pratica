const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { checkAuth } = require('../helpers/AuthChecker')


// router.get('/:id', UserController.viewUser)

router.get('/dashboard', checkAuth, UserController.viewDashboard)

router.get('/update', checkAuth, UserController.editUser)
router.post('/update', checkAuth, UserController.editUserPost)

router.get('/changepassword', checkAuth, UserController.changePassword)
router.post('/changepassword', checkAuth, UserController.changePasswordPost)


module.exports = router