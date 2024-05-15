'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(
        models.Event,
        { foreignKey: 'venueId', onDelete: 'CASCADE', hooks: true }
      )
      Venue.belongsTo(
        models.Group,
        { foreignKey: 'groupId' }
      )
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -90.0,
        max: 90.0,
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -180.0,
        max: 180.0
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
