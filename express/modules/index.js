const sequelize = require('../config/database')
const User = require('./user')
const Task = require('./task')

// 一对多关联：一个用户拥有多个任务
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' })
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// 模型集合
const db = {
  sequelize,
  User,
  Task
}

// sync({force:true}) 强制删表重建
async function syncTable() {
  await sequelize.sync({ force: false })
  console.log('📦 数据表同步完成')
}
syncTable()

module.exports = db
