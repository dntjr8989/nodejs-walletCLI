const Sequelize = require('sequelize');

module.exports = class Wallet extends Sequelize.Model{

    static init(sequelize)
    {
        return super.init({
            money : {
                type : Sequelize.INTEGER,
                allowNull : false,
            },
            desc:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            type:{
                type:Sequelize.ENUM('income', 'expenditure'),
                allowNull:false,
            }
        },
        {
            sequelize,
            timestamps:true,
            paranoid:true,
            modelName : 'Wallet',
            tableName : 'Wallets',
        });
    }
};