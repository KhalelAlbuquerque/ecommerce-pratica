const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const checkAuth = require('../helpers/AuthChecker').checkAuth

router.get('/', ProductController.showProducts)

router.get('/create', checkAuth, ProductController.createProduct)
router.post('/create', checkAuth, ProductController.createProductPost)

router.get('/edit', checkAuth, ProductController.updateProduct)

module.exports = router