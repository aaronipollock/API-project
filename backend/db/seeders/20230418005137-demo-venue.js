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
      },
      {
        groupId: 5, // DevOps Practitioners
        address: '555 Pioneer Square',
        city: 'Portland',
        state: 'OR',
        lat: 45.5155,
        lng: -122.6789,
      },
      {
        groupId: 6, // UX/UI Design Masters
        address: '888 Venice Boulevard',
        city: 'Los Angeles',
        state: 'CA',
        lat: 34.0522,
        lng: -118.2437,
      },
      {
        groupId: 7, // Cybersecurity Alliance
        address: '777 Beacon Street',
        city: 'Boston',
        state: 'MA',
        lat: 42.3601,
        lng: -71.0589,
      },
      {
        groupId: 8, // Data Science Hub
        address: '444 Michigan Avenue',
        city: 'Chicago',
        state: 'IL',
        lat: 41.8781,
        lng: -87.6298,
      },
      {
        groupId: 9, // Mobile App Creators
        address: '999 16th Street Mall',
        city: 'Denver',
        state: 'CO',
        lat: 39.7392,
        lng: -104.9903,
      },
      {
        groupId: 10, // Quantum Computing Explorers
        address: '222 Broadway',
        city: 'New York',
        state: 'NY',
        lat: 40.7128,
        lng: -74.0060,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Market Street', '456 Pine Street', '789 Congress Avenue', '321 Brickell Avenue',
        '555 Pioneer Square', '888 Venice Boulevard', '777 Beacon Street', '444 Michigan Avenue',
        '999 16th Street Mall', '222 Broadway'] }
    }, {});
  }
};
