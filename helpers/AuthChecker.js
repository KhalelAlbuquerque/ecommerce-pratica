module.exports = class AuthChecker {
     static async checkAuth(req,res, next){
        if(req.session.userid){
            next()
        }
        else{
            req.flash('message', 'Faca o login para continuar')
            res.redirect('/login')
        }
    }
}