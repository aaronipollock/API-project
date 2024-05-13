'use strict';

const { GroupImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(options, [
      {
        groupId: 1,
        url: 'eventImageUrl1',
        preview: false,
      },
      {
        groupId: 2,
        url: 'groupImageUrl2',
        preview: true,
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2] }
    }, {});
  }
};
