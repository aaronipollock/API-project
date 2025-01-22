'use strict';

const { Event } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Event.bulkCreate([
        // Morning Events - Professional Development Focus
        {
          groupId: 1, // Cloud Computing
          venueId: 1,
          name: 'AWS Certification Study Session',
          description: 'Early morning intensive study session focusing on AWS Solutions Architect certification. Perfect for those preparing for certification. Breakfast provided!',
          type: 'In person',
          capacity: 30,
          price: 25.00,
          startDate: '2025-11-19 08:00:00',
          endDate: '2025-11-19 11:00:00'
        },
        {
          groupId: 2, // AI/ML
          venueId: 2,
          name: 'Deep Learning Breakfast Workshop',
          description: 'Morning deep dive into neural networks with hands-on PyTorch exercises. Start your day with AI! Continental breakfast included.',
          type: 'In person',
          capacity: 20,
          price: 35.00,
          startDate: '2025-11-20 07:30:00',
          endDate: '2025-11-20 10:30:00'
        },

        // Lunch & Learn Sessions
        {
          groupId: 3, // Full Stack
          venueId: 3,
          name: 'Lunch & Code: React Patterns',
          description: 'Bring your lunch and laptop for this interactive session on React hooks and state management. Perfect for your lunch break!',
          type: 'Online',
          capacity: 50,
          price: 0.00,
          startDate: '2025-11-21 12:00:00',
          endDate: '2025-11-21 13:30:00'
        },
        {
          groupId: 4, // Blockchain
          venueId: 4,
          name: 'Crypto Lunch Discussion',
          description: 'Informal lunch meetup to discuss latest blockchain trends and DeFi developments. Bring your questions and insights!',
          type: 'In person',
          capacity: 15,
          price: 10.00,
          startDate: '2025-11-22 12:30:00',
          endDate: '2025-11-22 14:00:00'
        },

        // Evening Workshops
        {
          groupId: 5, // DevOps
          venueId: 5,
          name: 'Evening Docker Workshop',
          description: 'After-hours deep dive into Docker and container orchestration. Perfect for professionals looking to level up their DevOps skills.',
          type: 'Online',
          capacity: 35,
          price: 30.00,
          startDate: '2025-11-23 18:00:00',
          endDate: '2025-11-23 21:00:00'
        },
        {
          groupId: 6, // UX/UI
          venueId: 6,
          name: 'Design Systems Happy Hour',
          description: 'Evening social and workshop on building scalable design systems. Networking and refreshments included!',
          type: 'In person',
          capacity: 25,
          price: 15.00,
          startDate: '2025-11-24 17:30:00',
          endDate: '2025-11-24 20:00:00'
        },

        // Weekend Intensive Workshops
        {
          groupId: 7, // Cybersecurity
          venueId: 7,
          name: 'Weekend Security Bootcamp',
          description: 'Intensive weekend workshop on ethical hacking and penetration testing. Includes hands-on labs and CTF challenges.',
          type: 'In person',
          capacity: 20,
          price: 199.00,
          startDate: '2025-11-25 09:00:00',
          endDate: '2025-11-26 17:00:00'
        },
        {
          groupId: 8, // Data Science
          venueId: 8,
          name: 'Saturday Data Visualization',
          description: 'Full-day immersion in data visualization techniques using Python. From basic plots to interactive dashboards.',
          type: 'Online',
          capacity: 40,
          price: 75.00,
          startDate: '2025-11-27 10:00:00',
          endDate: '2025-11-27 16:00:00'
        },

        // Multi-Day Events
        {
          groupId: 9, // Mobile App
          venueId: 9,
          name: 'Mobile App Hackathon',
          description: '48-hour hackathon to build innovative mobile apps. Prizes for top projects! All skill levels welcome.',
          type: 'In person',
          capacity: 100,
          price: 50.00,
          startDate: '2025-11-28 09:00:00',
          endDate: '2025-11-29 17:00:00'
        },
        {
          groupId: 10, // Quantum Computing
          venueId: 10,
          name: 'Quantum Computing Conference',
          description: 'Two-day conference featuring industry experts, hands-on labs, and networking opportunities. Limited seats available.',
          type: 'Online',
          capacity: 150,
          price: 299.00,
          startDate: '2025-11-30 08:00:00',
          endDate: '2025-12-01 18:00:00'
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error seeding events:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    try {
      return queryInterface.bulkDelete(options, {
        name: { [Op.in]: [
          'AWS Certification Study Session',
          'Deep Learning Breakfast Workshop',
          'Lunch & Code: React Patterns',
          'Crypto Lunch Discussion',
          'Evening Docker Workshop',
          'Design Systems Happy Hour',
          'Weekend Security Bootcamp',
          'Saturday Data Visualization',
          'Mobile App Hackathon',
          'Quantum Computing Conference'
        ]}
      }, {});
    } catch (error) {
      console.error('Error removing events:', error);
      throw error;
    }
  }
};
