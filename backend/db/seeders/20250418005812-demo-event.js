'use strict';

const { Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Event.bulkCreate([
        {
          groupId: 1, // Cloud Computing
          venueId: 1,
          name: 'AWS Certification Study Session',
          description: 'Join us for an intensive study session focusing on AWS Solutions Architect certification. We\'ll cover key services, best practices, and work through practice questions.',
          type: 'Online',
          capacity: 30,
          price: 0.00,
          startDate: '2025-11-19 18:00:00',
          endDate: '2025-11-19 20:00:00'
        },
        {
          groupId: 2, // AI/ML
          venueId: 2,
          name: 'Machine Learning Workshop: Neural Networks',
          description: 'Hands-on workshop building neural networks from scratch. Bring your laptop and be ready to code! We\'ll use Python and TensorFlow.',
          type: 'In person',
          capacity: 20,
          price: 25.00,
          startDate: '2025-11-20 14:00:00',
          endDate: '2025-11-20 17:00:00'
        },
        {
          groupId: 3, // Full Stack
          venueId: 3,
          name: 'Modern React Patterns & Practices',
          description: 'Deep dive into React hooks, context, and state management. Live coding session followed by Q&A.',
          type: 'Online',
          capacity: 50,
          price: 0.00,
          startDate: '2025-11-21 19:00:00',
          endDate: '2025-11-21 21:00:00'
        },
        {
          groupId: 4, // Blockchain
          venueId: 4,
          name: 'Web3 Hackathon: Build a DApp',
          description: 'Weekend hackathon! Build a decentralized application using Ethereum smart contracts. Prizes for top projects!',
          type: 'In person',
          capacity: 40,
          price: 50.00,
          startDate: '2025-11-23 09:00:00',
          endDate: '2025-11-24 17:00:00'
        }
      ], { validate: true });
      console.log('Events seeded successfully!');
    } catch (error) {
      console.error('Error seeding events:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'AWS Certification Study Session',
        'Machine Learning Workshop: Neural Networks',
        'Modern React Patterns & Practices',
        'Web3 Hackathon: Build a DApp'
      ]}
    }, {});
  }
};
