// Project dependencies
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')


// Calling models
const userSchema = require('./models/User')
const productSchema = require('./models/Product')

// Requiring routes
const productsRoutes = require('./routes/productsRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/usersRoutes')

// Data base connection require
const conn = require('./db/conn')

// Calling express instance
const app = express()

// Configurations / Middlewares
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(session({
    name:'session',
    saveUninitialized:false,
    secret:"senha",
    resave:false,
    cookie:{
        secure:false,
        maxAge:60*60*1000,
        httpOnly:true,
        expires: new Date(Date.now+60*60*1000)
    }
}))


app.use((req,res,next)=>{

    if(req.session.userid){
        res.locals.session = req.session
    }

    next()

})


// Routes middlewares
app.use('/products', productsRoutes)
app.use('/users', userRoutes)
app.use('/', authRoutes)


const ProductController = require('./controllers/ProductController')
app.get('/', ProductController.showProducts)

conn
.sync()
.then(()=>{
    console.log('Banco de dados autenticado!')
    app.listen(3000)
})
.catch(err=>console.log(err))