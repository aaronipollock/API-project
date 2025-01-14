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
        organizerId: 1, // Demo-lition
        name: 'Cloud Computing Enthusiasts',
        about: 'A community of cloud computing professionals and enthusiasts sharing knowledge about AWS, Azure, and Google Cloud. Join us for workshops, certification study groups, and networking events.',
        type: 'Online',
        private: false,
        city: 'San Francisco',
        state: 'CA',
      },
      {
        organizerId: 2, // TechLead
        name: 'AI/ML Study Group',
        about: 'Dive deep into artificial intelligence and machine learning concepts. From neural networks to deep learning, we explore cutting-edge AI technologies through hands-on projects.',
        type: 'In person',
        private: false,
        city: 'Seattle',
        state: 'WA',
      },
      {
        organizerId: 3, // FullStackAlex
        name: 'Full Stack Developer Network',
        about: 'Connect with fellow developers to discuss modern web development practices, frameworks, and architectures. Regular code reviews, pair programming sessions, and tech talks.',
        type: 'Online',
        private: false,
        city: 'Austin',
        state: 'TX',
      },
      {
        organizerId: 4, // CloudArchitect
        name: 'Blockchain Innovators',
        about: 'Exploring the future of Web3, smart contracts, and decentralized applications. Join us for hackathons, technical discussions, and hands-on blockchain development workshops.',
        type: 'In person',
        private: true,
        city: 'Miami',
        state: 'FL',
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Cloud Computing Enthusiasts', 'AI/ML Study Group', 'Full Stack Developer Network', 'Blockchain Innovators']}
    }, {});
  }
};
