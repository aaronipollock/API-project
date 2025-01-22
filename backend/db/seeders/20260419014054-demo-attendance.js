'use strict';

const { Attendance } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Attendance.bulkCreate([
        // AWS Certification Study Session (Event 1) - Popular morning event
        {
          eventId: 1,
          userId: 1, // Demo-lition - Group organizer
          status: 'attending'
        },
        {
          eventId: 1,
          userId: 2, // TechLead - Regular cloud learner
          status: 'attending'
        },
        {
          eventId: 1,
          userId: 4, // CloudArchitect - Co-host and mentor
          status: 'attending'
        },
        {
          eventId: 1,
          userId: 5, // DevOpsJames - Infrastructure focus
          status: 'waitlist'
        },
        {
          eventId: 1,
          userId: 8, // DataScientist - Expanding cloud knowledge
          status: 'pending'
        },

        // Deep Learning Workshop (Event 2) - Technical morning session
        {
          eventId: 2,
          userId: 2, // TechLead - Event organizer
          status: 'attending'
        },
        {
          eventId: 2,
          userId: 10, // AIEngineer - Co-host
          status: 'attending'
        },
        {
          eventId: 2,
          userId: 3, // FullStackAlex - Learning AI
          status: 'waitlist'
        },
        {
          eventId: 2,
          userId: 8, // DataScientist - AI enthusiast
          status: 'attending'
        },

        // Lunch & Code: React Patterns (Event 3) - Popular online lunch event
        {
          eventId: 3,
          userId: 3, // FullStackAlex - Host
          status: 'attending'
        },
        {
          eventId: 3,
          userId: 1, // Demo-lition - Co-host
          status: 'attending'
        },
        {
          eventId: 3,
          userId: 6, // UIDesigner - Frontend focus
          status: 'attending'
        },
        {
          eventId: 3,
          userId: 9, // MobileDev - Cross-platform interest
          status: 'waitlist'
        },

        // Crypto Lunch Discussion (Event 4) - Exclusive blockchain event
        {
          eventId: 4,
          userId: 4, // CloudArchitect - Host
          status: 'attending'
        },
        {
          eventId: 4,
          userId: 10, // AIEngineer - Crypto enthusiast
          status: 'attending'
        },
        {
          eventId: 4,
          userId: 1, // Demo-lition - Learning blockchain
          status: 'pending'
        },

        // Evening Docker Workshop (Event 5) - Technical evening session
        {
          eventId: 5,
          userId: 5, // DevOpsJames - Host
          status: 'attending'
        },
        {
          eventId: 5,
          userId: 4, // CloudArchitect - Co-host
          status: 'attending'
        },
        {
          eventId: 5,
          userId: 1, // Demo-lition - DevOps learner
          status: 'attending'
        },
        {
          eventId: 5,
          userId: 6, // UIDesigner - New to DevOps
          status: 'waitlist'
        },

        // Design Systems Happy Hour (Event 6) - Social evening event
        {
          eventId: 6,
          userId: 6, // UIDesigner - Host
          status: 'attending'
        },
        {
          eventId: 6,
          userId: 3, // FullStackAlex - Frontend interest
          status: 'attending'
        },
        {
          eventId: 6,
          userId: 9, // MobileDev - Mobile UI focus
          status: 'attending'
        },
        {
          eventId: 6,
          userId: 8, // DataScientist - Data viz interest
          status: 'pending'
        },

        // Weekend Security Bootcamp (Event 7) - Intensive weekend training
        {
          eventId: 7,
          userId: 7, // SecurityExpert - Host
          status: 'attending'
        },
        {
          eventId: 7,
          userId: 4, // CloudArchitect - Cloud security
          status: 'attending'
        },
        {
          eventId: 7,
          userId: 5, // DevOpsJames - DevSecOps focus
          status: 'attending'
        },
        {
          eventId: 7,
          userId: 1, // Demo-lition - Security interest
          status: 'waitlist'
        },

        // Data Visualization Workshop (Event 8) - Hybrid weekend session
        {
          eventId: 8,
          userId: 8, // DataScientist - Host
          status: 'attending'
        },
        {
          eventId: 8,
          userId: 2, // TechLead - ML visualization
          status: 'attending'
        },
        {
          eventId: 8,
          userId: 6, // UIDesigner - Design patterns
          status: 'attending'
        },
        {
          eventId: 8,
          userId: 3, // FullStackAlex - Data viz learning
          status: 'pending'
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error seeding attendances:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Attendances';
    const Op = Sequelize.Op;
    try {
      return queryInterface.bulkDelete(options, {
        eventId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
      }, {});
    } catch (error) {
      console.error('Error removing attendances:', error);
      throw error;
    }
  }
};
