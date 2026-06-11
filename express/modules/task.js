const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

// 任务模型，自动生成 tasks 表
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // 0=未完成 1=已完成
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'tasks'
})

module.exports = Task
