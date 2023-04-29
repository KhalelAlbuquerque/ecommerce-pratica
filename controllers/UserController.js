const userSchema = require('../models/User')

module.exports = class UserController{

    static register(req,res){
        res.render('users/register')
    }

    static async registerPost(req,res){

        const {name, email, password, passwordconfirm} = req.body


        //Checking if email exists in database
        const checkEmail = await userSchema.findOne({where:{email:email}})
        if(checkEmail){
            console.log('Email já cadastrado!')
            res.render('users/register')
            return
        }

        //Checking if password and confirm matches
        if(password!=passwordconfirm){
            console.log('As senhas não são iguais')
            res.render('users/register')
            return
        }


        //Creating User
        const newUser = {
            name,
            email,
            password
        }

        await userSchema.create(newUser)
        res.redirect('/')

    }

}