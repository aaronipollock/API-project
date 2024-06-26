'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(
        models.Attendance,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
        )
      User.hasMany(
        models.Group,
        { foreignKey: 'organizerId', onDelete: 'CASCADE', hooks: true }
      )
      User.hasMany(
        models.Membership,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
      )
      User.belongsToMany(
        models.Group, {
          through: 'Membership',
          foreignKey: 'userId',
          otherKey: 'groupId',
        }
      )
      User.belongsToMany(
        models.Event, {
          through: 'Attendance',
          foreignKey: 'userId',
          otherKey: 'eventId'
        }
      )
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(val) {
            if (Validator.isEmail(val)) {
              throw new Error("Cannot be an email.")
            }
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashPassword", "email", "createdAt", "updatedAt"]
        }
      }
    });
  return User;
};
