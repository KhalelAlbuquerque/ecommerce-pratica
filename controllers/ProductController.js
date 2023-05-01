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

        const UserId = req.session.userid
        const {name, category, price, id} = req.body

        const foundProduct = await productSchema.findOne({where:{id:id, UserId:UserId}})

        if(!foundProduct){
            console.log('Produto não encontrado')
            res.redirect('/users/dashboard')
            return
        }

        const updatedProduct = {
            id,
            name,
            category,
            price,
            UserId
        }

        await productSchema.update(updatedProduct, {where:{id:id}})
        console.log('Produto atulaizado!')

        res.redirect('/users/dashboard')

    }


    static async deleteProduct(req,res){

        const id = req.query.id
        const UserId = req.session.userid

        const foundProduct = await productSchema.findOne({where:{id:id, UserId:UserId}})
        
        if(!foundProduct){
            console.log('Produto não encontrado')
            res.redirect('/users/dashboard')
            return
        }

        await productSchema.destroy({where:{id:id, UserId:UserId}})

        console.log('Produto deletado!')
        res.redirect('/users/dashboard')
    }


    static async viewProduct(req,res){

        const id = req.params.id

        const product = await productSchema.findOne({include:userSchema, where:{id:id}})

        if(!product){
            console.log("Produto não encontrado!")
            res.redirect('/')
            return
        }

        console.log('Produto encontrado!')
        console.log(product.get({plain:true}))
        res.render('products/view', {product:product.get({plain:true})})

    }

}