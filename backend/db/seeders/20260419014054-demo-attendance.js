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
      // AWS Certification Study Session (Event 1)
      {
        eventId: 1,
        userId: 1, // Demo-lition
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 2, // TechLead
        status: 'attending',
      },
      {
        eventId: 1,
        userId: 4, // CloudArchitect
        status: 'attending',
      },
      // Machine Learning Workshop (Event 2)
      {
        eventId: 2,
        userId: 2, // TechLead
        status: 'attending',
      },
      {
        eventId: 2,
        userId: 3, // FullStackAlex
        status: 'waitlist',
      },
      // Modern React Patterns (Event 3)
      {
        eventId: 3,
        userId: 1, // Demo-lition
        status: 'attending',
      },
      {
        eventId: 3,
        userId: 3, // FullStackAlex
        status: 'attending',
      },
      // Web3 Hackathon (Event 4)
      {
        eventId: 4,
        userId: 4, // CloudArchitect
        status: 'attending',
      },
      {
        eventId: 4,
        userId: 1, // Demo-lition
        status: 'waitlist',
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
