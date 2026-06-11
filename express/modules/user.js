const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// 创建User模型，自动生成users数据表
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false, // 非空
    unique: true      // 唯一
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickName: DataTypes.STRING
}, {
  timestamps: true, // 自动添加 createdAt、updatedAt
  tableName: 'users'
})


module.exports = User