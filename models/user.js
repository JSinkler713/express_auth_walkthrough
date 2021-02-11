'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    validPassword(typedPassword) {
      let isCorrectPassword = bcrypt.compareSync(typedPassword, this.password);
      return isCorrectPassword
    }

    toJSON() {
      let userData = this.get();
      // deletes password from returned user
      delete userData.password;
      return userData;
    }
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 99],
        msg: 'Name must be betweein 1 and 99 chars'
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 99],
        msg: 'Password must be between 8 and 99'
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', (pendingUser)=> {
    // encrypt before saving in the db
    let hash = bcrypt.hashSync(pendingUser.password, 12);
    pendingUser.password = hash;
  })

  return user;
};
