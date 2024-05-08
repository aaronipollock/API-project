'use strict';
const {
  Model
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
        { foreignKey: 'eventId' }
      )
      Event.hasMany(
        models.Attendance,
        { foreignKey: 'eventId' }
      )
      Event.belongsTo(
        models.Venue,
        { foreignKey: 'venueId' }
      )
      Event.belongsTo(
        models.Group,
        { foreignKey: 'groupId' }
      )
    }
  }
  Event.init({
    venueId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
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
      allowNull: false,
    },
    type: DataTypes.ENUM('Online', 'In person'),
    capacity: DataTypes.INTEGER,
    price: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
      }
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

