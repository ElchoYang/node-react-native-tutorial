const { Sequelize } = require('sequelize')

// 参数：库名、账号、密码、配置对象
const sequelize = new Sequelize('mydb', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // 关闭SQL日志打印 
})

// 测试连接方法
async function testDB() {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL数据库连接成功')
  } catch (err) {
    console.error('❌ 数据库连接失败：', err)
  }
}
testDB()

module.exports = sequelize