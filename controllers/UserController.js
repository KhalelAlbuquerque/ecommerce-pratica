const userSchema = require('../models/User')
const productSchema = require('../models/Product')
const bcrypt = require('bcryptjs')

module.exports = class UserController{

    static async viewDashboard(req,res){
        const userId = req.session.userid

        const user = await userSchema.findOne({include:productSchema, where:{id:userId}})

        if(!user.Products){
            user.Products=false
        }

        res.render('user/dashboard', {user:user.get({plain:true})})
    }

    static async editUser(req,res){

        const id = req.session.userid

        const userFound = await userSchema.findOne({raw:true, where:{id:id}})

        if(!userFound){
            req.flash('message', 'Usuario não encontrado!')
            res.redirect('/')
        }else{
            try{
                res.render('user/editUser', {user:userFound})
            }catch(err){
                console.log(err)
            }
        }
    }

    static async editUserPost(req,res){

        const {name,email,phone} = req.body
        const id = req.session.userid

        const newUserData = {
            id,
            name,
            email,
            phone
        }

        try{
            await userSchema.update(newUserData, {where:{id:id}})
            req.flash('message', 'Informações alteradas!')
            res.redirect('/users/dashboard')
        }catch(err){
            console.log(err)
        }

    }

    static changePassword(req,res){

        res.render('user/changePassword')
        
    }

    static async changePasswordPost(req,res){

        const id = req.session.userid

        const {oldPassword, newPassword, newPasswordConfirm} = req.body

        const userData = await userSchema.findOne({raw:true, where:{id:id}})

        //if it dont find any user with the id
        if(!userData){
            req.flash('message', 'Usuario não encontrado!')
            res.redirect('/users/dashboard')
            return
        }

        //if new password match with the confirmation
        if(newPassword!=newPasswordConfirm){
            req.flash('message', 'A nova senha a confirmação não são iguais!')
            res.redirect('/users/changepassword')
            return
        }

        const matchedPassord = bcrypt.compareSync(oldPassword, userData.password)

        //if the "oldPassword" match with the users password
        if(!matchedPassord){
            req.flash('message', 'Senha anterior incorreta!')
            res.redirect('/users/changepassword')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const newHash = {
            password:bcrypt.hashSync(newPassword, salt)
        }

        try{
            await userSchema.update(newHash, {where:{id:id}})
            req.flash('message', 'Senha alterada!')
            res.redirect('/users/dashboard')
            return
        }catch(err){
            console.log(err)
        }
        

    }


}