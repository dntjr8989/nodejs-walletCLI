#!/usr/bin/env node
const {program} = require('commander');
const inquirer = require('inquirer');
const Wallet = require('./models/wallet');
const {sequelize} = require('./models');
const {version} = require('./package');

program
    .version(version, '-v --version')
    .name('account');

const incomef = async(money,desc)=>{
    await sequelize.sync();
    await Wallet.create({money : parseInt(money, 10),desc,type:'income'});
    console.log(`수입 ${money}가 기록되었습니다`);
    await sequelize.close();
};

const expensef = async(money,desc)=>{
    await sequelize.sync();
    await Wallet.create({money : parseInt(money, 10),desc,type:'expenditure'});
    console.log(`지출 ${money}가 기록되었습니다`);
    await sequelize.close();
};

const balancef = async()=>{
    let incomeSum = 0;
    let expenditureSum = 0;
    await sequelize.sync();
    (await Wallet.findAll()).forEach((p)=>{
        if(p.type === 'income') incomeSum = incomeSum + p.money;
        else expenditureSum = expenditureSum + p.money;
    });
    console.log(`잔액 : ${incomeSum - expenditureSum}`);
    await sequelize.close();
};
//수입
program
    .command('revenue <money> <desc>')
    .description('수입을 기록합니다.')
    .action((money, desc)=>
    {
        incomef(money,desc);
    });
//지출
program
    .command('expense <money> <desc>')
    .description('지출을 기록합니다.')
    .action((money, desc)=>{
        expensef(money,desc);
    });
//잔액
program
    .command('balance')
    .description('잔액을 보여줍니다.')
    .action(()=>
    {
        balancef();
    });

program.action((cmd, args)=>{
    if( !args )
    {
        inquirer.prompt([
            {
                type : 'list',
                name : 'context',
                message : '무슨 일을 하실건가요?',
                choices:['수입', '지출', '잔액'],
            },
            {
                type: 'input',
                name: 'money',
                message : '가격을 입력해주세요 ',
                when(answers)
                {
                    return !(answers.context === '잔액');
                }
            },
            {
                type: 'input',
                name: 'desc',
                message : '어떤 내용인지 설명해주세요 ',
                when(answers)
                {
                    return !(answers.context === '잔액');
                }
            }
        ]).then((answers)=>{
            if(answers.money || answers.desc)
            {
                if(answers.context == '수입') incomef(answers.money, answers.desc);
                else  expensef(answers.money, answers.desc);
            }
            else{
                balancef();
            }
        });
    }
});


program.parse(process.argv);