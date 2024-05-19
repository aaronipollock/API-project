'use strict';
const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(
        models.EventImage,
        { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true }
      )
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId', onDelete: 'CASCADE', hooks: true }
      )
      Event.belongsTo(
        models.Venue,
        { foreignKey: 'venueId' }
      )
      Event.belongsTo(
        models.Group,
        { foreignKey: 'groupId' }
      )
      Event.belongsToMany(
        models.User, {
          through: 'Attendance',
          foreignKey: 'eventId',
          otherKey: 'userId',
        }
      )
    }
  }
  Event.init({
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5],
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
    },
    type: DataTypes.ENUM('Online', 'In person'),
    capacity: DataTypes.INTEGER,
    price: {
      type: DataTypes.FLOAT,
    },
    startDate: {
      type: DataTypes.DATE,
      validate: {
        isFutureDate(val) {
          if (val <= new Date()) {
            throw new Error('Start date must be in the future')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        isLessThanStart(val) {
          if (val <= this.startDate) {
            throw new Error('End date is less than start date')
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
