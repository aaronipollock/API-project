'use strict';

const { GroupImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1, // Cloud Computing
        url: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 2, // AI/ML
        url: 'https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=1469&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 3, // Full Stack
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1469&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 4, // Blockchain
        url: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1469&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 5, // DevOps
        url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 6, // UX/UI
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1464&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 7, // Cybersecurity
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 8, // Data Science
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 9, // Mobile App
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1474&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 10, // Quantum Computing
        url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 11, // AR/VR Development Lab
        url: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      },
      {
        groupId: 12, // Code Mentorship Circle
        url: 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?q=80&w=1470&auto=format&fit=crop',
        preview: true,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
    }, {});
  }
};
