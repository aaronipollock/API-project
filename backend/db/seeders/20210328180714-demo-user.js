'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@tech.io',
        username: 'TechLead',
        hashedPassword: bcrypt.hashSync('password2'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Alex',
        lastName: 'Kumar',
        email: 'alex@dev.io',
        username: 'FullStackAlex',
        hashedPassword: bcrypt.hashSync('password3'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria@code.io',
        username: 'CloudArchitect',
        hashedPassword: bcrypt.hashSync('password4'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james@tech.io',
        username: 'DevOpsJames',
        hashedPassword: bcrypt.hashSync('password5'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Emily',
        lastName: 'Zhang',
        email: 'emily@dev.io',
        username: 'UIDesigner',
        hashedPassword: bcrypt.hashSync('password6'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@code.io',
        username: 'SecurityExpert',
        hashedPassword: bcrypt.hashSync('password7'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Sofia',
        lastName: 'Rodriguez',
        email: 'sofia@tech.io',
        username: 'DataScientist',
        hashedPassword: bcrypt.hashSync('password8'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david@dev.io',
        username: 'MobileDev',
        hashedPassword: bcrypt.hashSync('password9'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya@code.io',
        username: 'AIEngineer',
        hashedPassword: bcrypt.hashSync('password10'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
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
