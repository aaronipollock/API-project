'use strict';

const { Venue } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1, // Cloud Computing Enthusiasts
        address: '123 Market Street',
        city: 'San Francisco',
        state: 'CA',
        lat: 37.7935,
        lng: -122.3933,
      },
      {
        groupId: 2, // AI/ML Study Group
        address: '456 Pine Street',
        city: 'Seattle',
        state: 'WA',
        lat: 47.6062,
        lng: -122.3321,
      },
      {
        groupId: 3, // Full Stack Developer Network
        address: '789 Congress Avenue',
        city: 'Austin',
        state: 'TX',
        lat: 30.2672,
        lng: -97.7431,
      },
      {
        groupId: 4, // Blockchain Innovators
        address: '321 Brickell Avenue',
        city: 'Miami',
        state: 'FL',
        lat: 25.7617,
        lng: -80.1918,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Market Street', '456 Pine Street', '789 Congress Avenue', '321 Brickell Avenue'] }
    }, {});
  }
};
