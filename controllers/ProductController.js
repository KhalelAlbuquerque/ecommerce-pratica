const productSchema = require('../models/Product')

module.exports = class ProductController{

    static showProducts (req,res){

        console.log('hahahh')
        res.render('products/home')

    }

    

}