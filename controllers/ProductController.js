const productSchema = require('../models/Product')
const userSchema = require('../models/User')

module.exports = class ProductController{

    static async showProducts (req,res){
        const productsObject = await productSchema.findAll({include:userSchema})

        const products = productsObject.map((element)=>element.get({plain:true}))

        res.render('products/home', {products})
    }

    static createProduct (req,res){
        res.render('products/create')
    }
    
    static async createProductPost (req,res){

        const {name, category, price} = req.body
        const userId = req.session.userid

        const newProduct = {
            name, category, price, UserId:userId
        }
        await productSchema.create(newProduct)

        res.redirect('/users/dashboard')

    }

    static async updateProduct(req,res){
        const id = req.query.id

        const product = await productSchema.findOne({raw:true, where:{id:id}})

        if(product.UserId!=req.session.userid){
            console.log('Você não pode alterar esse produto!')
            res.redirect('/')
            return
        }

        res.render('products/edit', {product})

    }
    

    static async updateProductPost(req,res){

        

    }

}