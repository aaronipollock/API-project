'use strict';

const { Group } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Evening Tennis on the Water',
        about: 'Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.',
        type: 'In person',
        private: true,
        city: 'New York',
        state: 'NY',
      },
      {
        organizerId: 2,
        name: 'Real Estate Investor Networking',
        about: 'Meet and mingle with other like minded real estate investors to learn, partner, share ideas and knowledge about the market.',
        type: 'In person',
        private: true,
        city: 'Miami',
        state: 'FL',
      },
      {
        organizerId: 3,
        name: 'Learn Teach Code LA',
        about: "We're building a more diverse, tight-knit tech community across Los Angeles.",
        type: 'Online',
        private: false,
        city: 'Los Angeles',
        state: 'CA',
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Evening Tennis on the Water', 'Real Estate Investor Networking', 'Learn Teach Code LA']}
    }, {});
  }
};
