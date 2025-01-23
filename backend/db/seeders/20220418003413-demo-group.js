'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Groups';

    // First batch (1-3)
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Cloud Computing Enthusiasts',
        about: 'A community for cloud computing professionals.',
        type: 'Online',
        private: false,
        city: 'San Francisco',
        state: 'CA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 2,
        name: 'AI/ML Study Group',
        about: 'Dive deep into AI and ML concepts.',
        type: 'In person',
        private: false,
        city: 'Seattle',
        state: 'WA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 3,
        name: 'Full Stack Developer Network',
        about: 'Connect with fellow developers.',
        type: 'Online',
        private: false,
        city: 'Austin',
        state: 'TX',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Second batch (4-6)
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 4,
        name: 'Blockchain Innovators',
        about: 'Exploring Web3 and smart contracts.',
        type: 'In person',
        private: true,
        city: 'Miami',
        state: 'FL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 5,
        name: 'DevOps Practitioners',
        about: 'DevOps practices and automation.',
        type: 'Online',
        private: false,
        city: 'Portland',
        state: 'OR',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 6,
        name: 'UX/UI Design Masters',
        about: 'Creating beautiful interfaces.',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'CA',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Third batch (7-9)
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 7,
        name: 'Elite Cybersecurity Alliance',
        about: 'Advanced security techniques.',
        type: 'Online',
        private: true,
        city: 'Boston',
        state: 'MA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 8,
        name: 'Data Science Hub',
        about: 'Data science insights and tools.',
        type: 'In person',
        private: false,
        city: 'Chicago',
        state: 'IL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 9,
        name: 'Mobile App Innovators',
        about: 'Mobile development practices.',
        type: 'Online',
        private: false,
        city: 'Denver',
        state: 'CO',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Fourth batch (10-12)
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 10,
        name: 'Quantum Computing Pioneers',
        about: 'Quantum computing exploration.',
        type: 'In person',
        private: true,
        city: 'New York',
        state: 'NY',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 1,
        name: 'AR/VR Development Lab',
        about: 'AR/VR development frontiers.',
        type: 'In person',
        private: true,
        city: 'San Francisco',
        state: 'CA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizerId: 3,
        name: 'Code Mentorship Circle',
        about: 'Supporting new developers.',
        type: 'Online',
        private: false,
        city: 'Austin',
        state: 'TX',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: [
        'Cloud Computing Enthusiasts',
        'AI/ML Study Group',
        'Full Stack Developer Network',
        'Blockchain Innovators',
        'DevOps Practitioners',
        'UX/UI Design Masters',
        'Elite Cybersecurity Alliance',
        'Data Science Hub',
        'Mobile App Innovators',
        'Quantum Computing Pioneers',
        'AR/VR Development Lab',
        'Code Mentorship Circle'
      ]}
    }, {});
  }
};
