'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      // allowNull: false,
      // defaultValue: '',
    }, options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.removeColumn('Users', 'firstName', options);

  }
};
