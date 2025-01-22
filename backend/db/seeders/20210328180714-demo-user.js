'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@tech.io',
        username: 'TechLead',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Alex',
        lastName: 'Kumar',
        email: 'alex@dev.io',
        username: 'FullStackAlex',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria@code.io',
        username: 'CloudArchitect',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james@tech.io',
        username: 'DevOpsJames',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Emily',
        lastName: 'Zhang',
        email: 'emily@dev.io',
        username: 'UIDesigner',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@code.io',
        username: 'SecurityExpert',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: 'Sofia',
        lastName: 'Rodriguez',
        email: 'sofia@tech.io',
        username: 'DataScientist',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david@dev.io',
        username: 'MobileDev',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya@code.io',
        username: 'AIEngineer',
        hashedPassword: bcrypt.hashSync('password10')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'TechLead', 'FullStackAlex', 'CloudArchitect',
        'DevOpsJames', 'UIDesigner', 'SecurityExpert', 'DataScientist', 'MobileDev', 'AIEngineer'] }
    }, {});
  }
};
