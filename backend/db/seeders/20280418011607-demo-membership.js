'use strict';

const { Membership } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate([
      // Cloud Computing Enthusiasts (Group 1)
      {
        userId: 1, // Demo-lition
        groupId: 1,
        status: 'organizer'
      },
      {
        userId: 4, // CloudArchitect
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 2, // TechLead
        groupId: 1,
        status: 'member'
      },

      // AI/ML Study Group (Group 2)
      {
        userId: 2, // TechLead
        groupId: 2,
        status: 'organizer'
      },
      {
        userId: 1, // Demo-lition
        groupId: 2,
        status: 'member'
      },
      {
        userId: 3, // FullStackAlex
        groupId: 2,
        status: 'pending'
      },

      // Full Stack Developer Network (Group 3)
      {
        userId: 3, // FullStackAlex
        groupId: 3,
        status: 'organizer'
      },
      {
        userId: 1, // Demo-lition
        groupId: 3,
        status: 'co-host'
      },
      {
        userId: 2, // TechLead
        groupId: 3,
        status: 'member'
      },

      // Blockchain Innovators (Group 4)
      {
        userId: 4, // CloudArchitect
        groupId: 4,
        status: 'organizer'
      },
      {
        userId: 1, // Demo-lition
        groupId: 4,
        status: 'pending'
      },
      {
        userId: 3, // FullStackAlex
        groupId: 4,
        status: 'member'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
