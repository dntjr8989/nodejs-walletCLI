const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const Sequelize = require('sequelize');
const Wallet = require('./wallet');

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

const db = {};

db.Wallet = Wallet;
db.sequelize = sequelize;

Wallet.init(sequelize);

module.exports = db;