const userSchema = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{

    static register(req,res){
        if(req.session.userid){
            console.log('Voce ja esta logado!')
            res.redirect('/')
            return
        }
        res.render('auth/register')
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

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        //Creating User
        const newUser = {
            name,
            email,
            password:hash
        }
        
        try{
            const user = await userSchema.create(newUser)

            req.session.userid = user.id

            req.session.save(()=>{
                console.log("Usuario cadastrado!")

                res.redirect('/')
            })
            
        }catch(err){
            console.log(err)
        }

    }

    
    static login(req,res){
        if(req.session.userid){
            res.redirect('/')
            return
        }
        res.render('auth/login')
    }

}
