'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Group.bulkCreate([
        // Tech Community Flagship Groups
        {
          organizerId: 1, // Demo-lition - Our most active community leader
          name: 'Cloud Computing Enthusiasts',
          about: 'A community for cloud computing professionals sharing knowledge about AWS, Azure, and Google Cloud.',
          type: 'Online',
          private: false,
          city: 'San Francisco',
          state: 'CA',
        },
        {
          organizerId: 2, // TechLead - AI/ML expert
          name: 'AI/ML Study Group',
          about: 'Dive deep into AI and ML concepts. From neural networks to deep learning, we explore cutting-edge technologies.',
          type: 'In person',
          private: false,
          city: 'Seattle',
          state: 'WA',
        },

        // Developer-Focused Groups
        {
          organizerId: 3, // FullStackAlex - Experienced full-stack developer
          name: 'Full Stack Developer Network',
          about: 'Connect with fellow developers to discuss modern web development practices, frameworks, and architectures. Regular code reviews, pair programming sessions, and tech talks. Monthly hackathons and project showcases.',
          type: 'Online',
          private: false,
          city: 'Austin',
          state: 'TX',
        },
        {
          organizerId: 4, // CloudArchitect - Blockchain expert
          name: 'Blockchain Innovators',
          about: 'Exploring the future of Web3, smart contracts, and decentralized applications. Join us for hackathons, technical discussions, and hands-on blockchain development workshops. Limited membership for focused collaboration.',
          type: 'In person',
          private: true,
          city: 'Miami',
          state: 'FL',
        },

        // DevOps and Infrastructure
        {
          organizerId: 5, // DevOpsJames - Infrastructure specialist
          name: 'DevOps Practitioners',
          about: 'A community focused on DevOps practices, CI/CD pipelines, and infrastructure automation. Share experiences with tools like Docker, Kubernetes, and Jenkins. Bi-weekly infrastructure challenges and tool demonstrations.',
          type: 'Online',
          private: false,
          city: 'Portland',
          state: 'OR',
        },

        // Design and UX Groups
        {
          organizerId: 6, // UIDesigner - Design systems expert
          name: 'UX/UI Design Masters',
          about: 'For designers passionate about creating beautiful and functional user interfaces. Weekly design critiques, workshops on latest design tools, and discussion of UX principles. Portfolio reviews and mentor matching.',
          type: 'In person',
          private: false,
          city: 'Los Angeles',
          state: 'CA',
        },

        // Security and Data Groups
        {
          organizerId: 7, // SecurityExpert
          name: 'Elite Cybersecurity Alliance',
          about: 'Advanced cybersecurity techniques and threat analysis. CTF events, penetration testing workshops, and security architecture reviews. Private group for verified security professionals.',
          type: 'Online',
          private: true,
          city: 'Boston',
          state: 'MA',
        },
        {
          organizerId: 8, // DataScientist
          name: 'Data Science Hub',
          about: 'A group for data scientists and analysts to share insights, techniques, and tools. Focus on data visualization, statistical analysis, and predictive modeling. Monthly kaggle competitions and dataset challenges.',
          type: 'In person',
          private: false,
          city: 'Chicago',
          state: 'IL',
        },

        // Mobile and Emerging Tech
        {
          organizerId: 9, // MobileDev
          name: 'Mobile App Innovators',
          about: 'Community of iOS and Android developers sharing mobile development best practices. Regular app showcases, code reviews, and discussions about mobile UX. Beta testing network and app launch support.',
          type: 'Online',
          private: false,
          city: 'Denver',
          state: 'CO',
        },
        {
          organizerId: 10, // AIEngineer
          name: 'Quantum Computing Pioneers',
          about: 'Exclusive group exploring quantum computing and its applications. Theoretical discussions, practical implementations, and industry trends analysis. Limited to experienced quantum computing professionals.',
          type: 'In person',
          private: true,
          city: 'New York',
          state: 'NY',
        },

        // New Additional Groups
        {
          organizerId: 1, // Demo-lition - Leading another innovative group
          name: 'AR/VR Development Lab',
          about: 'Exploring the frontiers of augmented and virtual reality development. Weekly hands-on sessions with latest AR/VR hardware, SDK exploration, and project collaborations.',
          type: 'In person',
          private: true,
          city: 'San Francisco',
          state: 'CA',
        },
        {
          organizerId: 3, // FullStackAlex - Starting a beginner-friendly group
          name: 'Code Mentorship Circle',
          about: 'Supporting new developers in their coding journey. Regular mentorship sessions, code reviews, and career guidance. Focus on building real-world projects and portfolio development.',
          type: 'Online',
          private: false,
          city: 'Austin',
          state: 'TX',
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error seeding groups:', error);
      throw error; // Re-throw to fail the migration if needed
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    try {
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
    } catch (error) {
      console.error('Error removing groups:', error);
      throw error;
    }
  }
};
