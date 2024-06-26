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
        venueId: 1,
        name: 'Tennis Group First Meet and Greet',
        description: 'First meet and greet event for the evening tennis on the water group! Join us online for happy times!',
        type: 'Online',
        capacity: 10,
        price: 18.51,
        startDate: '2024-11-19 20:00:00',
        endDate: '2024-11-19 22:00:00'
      },
      {
        groupId: 1,
        venueId: 1,
        name: 'Tennis Singles',
        type: 'In person',
        startDate: '2024-11-20 20:00:00',
        endDate: '2024-11-20 22:00:00'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Tennis Group First Meet and Greet',
        'Tennis Singles'] }
    }, {});
  }
};
