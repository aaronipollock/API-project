'use strict';

const { EventImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'eventImageUrl1',
        preview: true,
      },
      {
        eventId: 2,
        url: 'eventImageUrl2',
        preview: false,
      }
    ], Object.assign({ validate: true }, options))
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete({
      eventId: { [Op.in]: [1, 2] }
    }, options);
  }
};
