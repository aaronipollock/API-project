require('dotenv').config();
const { execSync } = require('child_process');

const dbUrl = 'postgresql://app_academy_projects_ysx1_user:UO0sKyMWExOYWb8UKkEekoSiDV0nF03x@dpg-cp5diqocmk4c73f08od0-a.oregon-postgres.render.com/app_academy_projects_ysx1';

console.log('DATABASE_URL:', dbUrl);
console.log('SCHEMA:', process.env.SCHEMA);

const runCommands = () => {
  const commands = [
    `psql "${dbUrl}?sslmode=require" -c "DROP SCHEMA IF EXISTS ${process.env.SCHEMA} CASCADE"`,
    `psql "${dbUrl}?sslmode=require" -c "CREATE SCHEMA ${process.env.SCHEMA}"`
  ];

  for (let command of commands) {
    try {
      execSync(command);
      console.log(`Successfully executed: ${command}`);
    } catch (error) {
      console.error(`Error executing command: ${command}`);
      console.error('Error details:', error.message);
      process.exit(1);
    }
  }
};

runCommands();
