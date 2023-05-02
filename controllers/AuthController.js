const userSchema = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController{

    static register(req,res){
        if(req.session.userid){
            req.flash('message', 'Você já está logado!')
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
            req.flash('message', 'Email já cadastrado!')
            res.render('users/register')
            return
        }

        //Checking if password and confirm matches
        if(password!=passwordconfirm){
            creq.flash('message', 'As senhas não são iguais')
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
                req.flash('message', "Usuario cadastrado!")

                res.redirect('/')
            })
            
        }catch(err){
            console.log(err)
        }

    }

    
    static login(req,res){
        if(req.session.userid){
            console.log('Voce ja esta logado!')
            res.redirect('/')
            return
        }
        res.render('auth/login')
    }

    static async loginPost(req,res){
        const {email, password} = req.body

        //Check if email exists in database
        const userCheckedEmail = await userSchema.findOne({raw:true, where:{email:email}})
        if(!userCheckedEmail){

            req.flash('message', 'Email incorreto')
            res.redirect('/login')
            return
        }

        //Check if password match
        try{
            const matchedPassword = bcrypt.compareSync(password, userCheckedEmail.password)

            if(matchedPassword){
                req.session.userid=userCheckedEmail.id
                req.session.save(()=>{

                    req.flash('message', 'Login efetuado!')
                    res.redirect('/')
                })
            }else{
                req.flash('message', 'Senha incorreta!')
                res.redirect('/login')
            }

        }catch(err){

            console.log(err)
        }
    }

    static logout(req,res){
        if(!req.session.userid){
            req.flash('message','Você deve fazer o login para continuar')
            res.redirect('/login')
            return
        }

        req.session.destroy()
        res.redirect('/')
    }

}
