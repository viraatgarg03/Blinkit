const {DataTypes}=require('sequelize');
const sequelize = require('../Config/db');

const Product= sequelize.define('Product', {

    p_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull:true,
    },

});

module.exports=Product;
