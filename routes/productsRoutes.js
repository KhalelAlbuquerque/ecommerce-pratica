const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const checkAuth = require('../helpers/AuthChecker').checkAuth

router.get('/', ProductController.showProducts)

router.get('/create', checkAuth, ProductController.createProduct)
router.post('/create', checkAuth, ProductController.createProductPost)

router.get('/edit', checkAuth, ProductController.updateProduct)
router.post('/edit', checkAuth, ProductController.updateProductPost)

router.get('/delete', checkAuth, ProductController.deleteProduct)

router.get('/:id', ProductController.viewProduct)

module.exports = router