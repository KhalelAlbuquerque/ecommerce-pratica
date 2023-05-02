const { query } = require('express')
const productSchema = require('../models/Product')
const userSchema = require('../models/User')
const {Op} = require('sequelize')

module.exports = class ProductController{

    static async showProducts (req,res){
        const search=req.query.search
        const category = req.query.category

        //if only category is null
        if(!category && search){
            const condition = {include:userSchema,
                               where:{name:{[Op.like]:`%${search}%`}}}

            const productsObject = await productSchema.findAll(condition)

            const products = productsObject.map((element)=>element.get({plain:true}))

            let qtyFound = products.length

            if(qtyFound=== 0){
                qtyFound='nenhum'
            }


            res.render('products/home', {products, search:`${search}`, qtyFound})

        //if only search is null
        }else if(!search && category){
            const condition = {include:userSchema,
                               where:{category:category}}

            const productsObject = await productSchema.findAll(condition)

            const products = productsObject.map((element)=>element.get({plain:true}))

            let qtyFound = products.length

            if(qtyFound=== 0){
                qtyFound='nenhum'
            }

            res.render('products/home', {products, search:`${category}` , qtyFound})

        //if nothing is null
        }else if(search && category){
            const condition = {include:userSchema,
                               where:{name:{[Op.like]:`%${search}%`},
                               category:category}}

            const productsObject = await productSchema.findAll(condition)

            const products = productsObject.map((element)=>element.get({plain:true}))

            let qtyFound = products.length

            if(qtyFound=== 0){
                qtyFound='nenhum'
            }

            res.render('products/home', {products, search:`${search} na aba de ${category}`, qtyFound})
        
        //if all is null
        }else{
            const productsObject = await productSchema.findAll({include:userSchema})

            const products = productsObject.map((element)=>element.get({plain:true}))

            //for the if on home handlebar
            const qtyFound = false

            res.render('products/home', {products, search, qtyFound})
        }


        
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
            req.flash('message','Você não pode alterar esse produto!')
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
            req.flash('message','Produto não encontrado')
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
        req.flash('message','Produto atulaizado!')

        res.redirect('/users/dashboard')

    }


    static async deleteProduct(req,res){

        const id = req.query.id
        const UserId = req.session.userid

        const foundProduct = await productSchema.findOne({where:{id:id, UserId:UserId}})
        
        if(!foundProduct){
            req.flash('message','Produto não encontrado')
            res.redirect('/users/dashboard')
            return
        }

        await productSchema.destroy({where:{id:id, UserId:UserId}})

        req.flash('message','Produto deletado!')
        res.redirect('/users/dashboard')
    }


    static async viewProduct(req,res){

        const id = req.params.id

        const product = await productSchema.findOne({include:userSchema, where:{id:id}})

        if(!product){
            req.flash('message',"Produto não encontrado!")
            res.redirect('/')
            return
        }

        req.flash('message','Produto encontrado!')
        req.flash('message',product.get({plain:true}))
        res.render('products/view', {product:product.get({plain:true})})
    }

}