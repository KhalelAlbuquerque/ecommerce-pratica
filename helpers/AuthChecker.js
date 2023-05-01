module.exports = class AuthChecker {
     static async checkAuth(req,res, next){
        if(req.session.userid){
            next()
        }
        else{
            res.redirect('/login')
            console.log('Faca o login para continuar')
        }
    }
}