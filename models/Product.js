const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const User = require('./User')

const Product = db.define('Product', {

    name:{
        type:DataTypes.STRING,
        requie:true,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        requie:true,
        allowNull:false
    },
    price:{
        type:DataTypes.FLOAT,
        requie:true,
        allowNull:false
    },

})

User.hasMany(Product)
Product.belongsTo(User)

module.exports = Product