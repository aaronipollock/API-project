'use strict';

const { Membership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Membership.bulkCreate([
        // Cloud Computing Enthusiasts (Group 1) - Large, active community
        {
          userId: 1, // Demo-lition - Founder and active organizer
          groupId: 1,
          status: 'organizer'
        },
        {
          userId: 4, // CloudArchitect - Technical advisor
          groupId: 1,
          status: 'co-host'
        },
        {
          userId: 2, // TechLead - Regular contributor
          groupId: 1,
          status: 'member'
        },
        {
          userId: 5, // DevOpsJames - Infrastructure expertise
          groupId: 1,
          status: 'member'
        },

        // AI/ML Study Group (Group 2) - Technical focus group
        {
          userId: 2, // TechLead - ML expert leading the group
          groupId: 2,
          status: 'organizer'
        },
        {
          userId: 1, // Demo-lition - Active in multiple communities
          groupId: 2,
          status: 'member'
        },
        {
          userId: 10, // AIEngineer - Bringing quantum expertise
          groupId: 2,
          status: 'co-host'
        },
        {
          userId: 3, // FullStackAlex - Seeking to expand ML knowledge
          groupId: 2,
          status: 'pending'
        },

        // Full Stack Developer Network (Group 3) - Diverse community
        {
          userId: 3, // FullStackAlex - Community builder
          groupId: 3,
          status: 'organizer'
        },
        {
          userId: 1, // Demo-lition - Helping manage growth
          groupId: 3,
          status: 'co-host'
        },
        {
          userId: 2, // TechLead - Sharing ML integration expertise
          groupId: 3,
          status: 'member'
        },
        {
          userId: 6, // UIDesigner - Frontend perspective
          groupId: 3,
          status: 'member'
        },

        // Blockchain Innovators (Group 4) - Exclusive group
        {
          userId: 4, // CloudArchitect - Blockchain expert
          groupId: 4,
          status: 'organizer'
        },
        {
          userId: 1, // Demo-lition - Exploring new tech
          groupId: 4,
          status: 'pending'
        },
        {
          userId: 3, // FullStackAlex - Web3 development
          groupId: 4,
          status: 'member'
        },
        {
          userId: 10, // AIEngineer - Quantum/blockchain crossover
          groupId: 4,
          status: 'member'
        },

        // DevOps Practitioners (Group 5) - Technical community
        {
          userId: 5, // DevOpsJames - Infrastructure leader
          groupId: 5,
          status: 'organizer'
        },
        {
          userId: 4, // CloudArchitect - Cloud expertise
          groupId: 5,
          status: 'co-host'
        },
        {
          userId: 6, // UIDesigner - Learning DevOps
          groupId: 5,
          status: 'pending'
        },
        {
          userId: 1, // Demo-lition - Infrastructure enthusiast
          groupId: 5,
          status: 'member'
        },

        // UX/UI Design Masters (Group 6) - Creative community
        {
          userId: 6, // UIDesigner - Design leader
          groupId: 6,
          status: 'organizer'
        },
        {
          userId: 7, // SecurityExpert - UX security perspective
          groupId: 6,
          status: 'member'
        },
        {
          userId: 8, // DataScientist - Data visualization interest
          groupId: 6,
          status: 'pending'
        },
        {
          userId: 3, // FullStackAlex - Frontend development
          groupId: 6,
          status: 'member'
        },

        // Elite Cybersecurity Alliance (Group 7) - Private security group
        {
          userId: 7, // SecurityExpert - Security leader
          groupId: 7,
          status: 'organizer'
        },
        {
          userId: 4, // CloudArchitect - Cloud security
          groupId: 7,
          status: 'member'
        },
        {
          userId: 5, // DevOpsJames - DevSecOps expertise
          groupId: 7,
          status: 'co-host'
        },

        // Data Science Hub (Group 8) - Analytics community
        {
          userId: 8, // DataScientist - Analytics expert
          groupId: 8,
          status: 'organizer'
        },
        {
          userId: 2, // TechLead - ML crossover
          groupId: 8,
          status: 'co-host'
        },
        {
          userId: 10, // AIEngineer - Advanced analytics
          groupId: 8,
          status: 'member'
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error seeding memberships:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    try {
      return queryInterface.bulkDelete(options, {
        groupId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
      }, {});
    } catch (error) {
      console.error('Error removing memberships:', error);
      throw error;
    }
  }
};
