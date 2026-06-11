// JWT 配置
const SECRET = 'node-rn-tutorial-secret-key' // 实际项目应放到环境变量
const EXPIRES_IN = '2h'                      // Token 有效期 2 小时

module.exports = { SECRET, EXPIRES_IN }
