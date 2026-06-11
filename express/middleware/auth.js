const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/jwt')

// JWT 鉴权中间件：从 Authorization 头取出 Token 并校验
module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'] || ''
  // 支持 "Bearer xxx" 和直接传 Token 两种格式
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  if (!token) {
    return res.json({ code: 401, msg: '未登录，请先登录' })
  }
  try {
    const payload = jwt.verify(token, SECRET)
    req.user = payload // 把用户信息挂到 req 上，后续路由可直接拿到当前用户
    next()
  } catch (e) {
    res.json({ code: 401, msg: 'Token 无效或已过期' })
  }
}
