'use strict';

const { Attendance } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 2,
        status: 'waitlist',
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['JohnSmith', 'Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
