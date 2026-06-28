const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const database = process.env.DB_NAME || 'blinkit';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'viraat18';
const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
    logging: false,
});

sequelize.initialize = async () => {
    const connection = await mysql.createConnection({ host, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.end();

    await sequelize.authenticate();
    console.log('Database connected successfully');
};

module.exports = sequelize;
