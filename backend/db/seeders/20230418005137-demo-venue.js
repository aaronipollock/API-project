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
        groupId: 1,
        address: '123 Disney Lane',
        city: 'New York',
        state: 'NY',
        lat: 37.7645358,
        lng: -122.4730327,
      }
    ], Object.assign({ validate: true }, options));
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      address: { [Op.in]: ['123 Disney Lane'] }
    }, options);
  }
};
