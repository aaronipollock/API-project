'use strict';

const { Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        groupId: 1,
        name: 'Tennis Group First Meet and Greet',
        type: 'Online',
        startDate: '2024-11-19 20:00:00',
        endDate: '2024-11-19 22:00:00'
      },
      {
        groupId: 2,
        venueId: 1,
        name: 'Tennis Singles',
        type: 'In person',
        startDate: '2024-11-20 20:00:00',
        endDate: '2024-11-20 22:00:00'
      }
    ], Object.assign({ validate: true }, options))
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      name: { [Op.in]: [
        'Tennis Group First Meet and Greet',
        'Tennis Singles'] }
    }, options);
  }
};
