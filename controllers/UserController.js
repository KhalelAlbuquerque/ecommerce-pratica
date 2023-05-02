const userSchema = require('../models/User')
const productSchema = require('../models/Product')

module.exports = class UserController{

    static async viewDashboard(req,res){
        const userId = req.session.userid

        const user = await userSchema.findOne({include:productSchema, where:{id:userId}})

        res.render('user/dashboard', {user:user.get({plain:true})})
    }

}