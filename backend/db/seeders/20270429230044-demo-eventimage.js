'use strict';

const { EventImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1, // AWS Certification
        url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 2, // Machine Learning
        url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1465&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 3, // React Patterns
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 4, // Web3 Hackathon
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 5, // Docker Workshop
        url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1506&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 6, // Design Systems
        url: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=1544&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 7, // Ethical Hacking
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 8, // Data Visualization
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 9, // Flutter Development
        url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        eventId: 10, // Quantum Computing
        url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
