// Project dependencies
const express = require('express')
const exphbs = require('express-handlebars')

// Requiring routes
const productsRoutes = require('./routes/productsRoutes')

// Data base connection require
const conn = require('./db/conn')

// Calling express instance
const app = express()

// Configurations / Middlewares
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// Routes middlewares
app.use('/products', productsRoutes)


conn
.sync()
.then(()=>{
    console.log('Banco de dados autenticado!')
    app.listen(3000)
})
.catch(err=>console.log(err))