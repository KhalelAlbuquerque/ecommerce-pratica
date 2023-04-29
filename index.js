// Project dependencies
const express = require('express')
const exphbs = require('express-handlebars')

// Calling models
const userSchema = require('./models/User')
const productSchema = require('./models/Product')

// Requiring routes
const productsRoutes = require('./routes/productsRoutes')
const usersRoutes = require('./routes/usersRoutes')

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

// Routes middlewares
app.use('/products', productsRoutes)
app.use('/', usersRoutes)

app.get('/', (req,res)=>{res.render('products/home')})

conn
.sync()
.then(()=>{
    console.log('Banco de dados autenticado!')
    app.listen(3000)
})
.catch(err=>console.log(err))