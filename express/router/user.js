const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../modules')
const { SECRET, EXPIRES_IN } = require('../config/jwt')
const auth = require('../middleware/auth')

// 1. 注册 POST /api/user/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, nickName } = req.body
    if (!username || !password) {
      return res.json({ code: 400, msg: '用户名和密码不能为空' })
    }
    // 密码加密存储
    const hash = await bcrypt.hash(password, 10)
    const info = await User.create({ username, password: hash, nickName })
    res.json({
      code: 200,
      msg: '注册成功',
      data: { id: info.id, username: info.username, nickName: info.nickName }
    })
  } catch (e) {
    res.json({ code: 500, msg: '注册失败', err: e.message })
  }
})

// 2. 登录 POST /api/user/login —— 校验密码并签发 Token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user) return res.json({ code: 401, msg: '用户不存在' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.json({ code: 401, msg: '密码错误' })

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: EXPIRES_IN }
    )
    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token,
        userInfo: { id: user.id, username: user.username, nickName: user.nickName }
      }
    })
  } catch (e) {
    res.json({ code: 500, msg: '登录失败', err: e.message })
  }
})

// 3. 用户列表 GET /api/user/list（需登录）
router.get('/list', auth, async (req, res) => {
  const list = await User.findAll({
    attributes: { exclude: ['password'] } // 不返回密码字段
  })
  res.json({ code: 200, data: list })
})

// 4. 修改 PUT /api/user/:id（需登录）
router.put('/:id', auth, async (req, res) => {
  const data = { ...req.body }
  // 若传了 password，需重新加密
  if (data.password) data.password = await bcrypt.hash(data.password, 10)
  await User.update(data, { where: { id: req.params.id } })
  res.json({ code: 200, msg: '修改完成' })
})

// 5. 删除 DELETE /api/user/:id（需登录）
router.delete('/:id', auth, async (req, res) => {
  await User.destroy({ where: { id: req.params.id } })
  res.json({ code: 200, msg: '删除完成' })
})

module.exports = router
