const express = require('express')
const router = express.Router()
const { Task, User } = require('../modules')
const auth = require('../middleware/auth')

// 全部任务接口都需要登录
router.use(auth)

// 1. 新增任务 POST /api/task/add
router.post('/add', async (req, res) => {
  try {
    const { title, content, status } = req.body
    if (!title) return res.json({ code: 400, msg: '任务标题不能为空' })
    // userId 直接从 Token 解出来，避免前端伪造
    const info = await Task.create({
      title,
      content,
      status,
      userId: req.user.id
    })
    res.json({ code: 200, msg: '新增成功', data: info })
  } catch (e) {
    res.json({ code: 500, msg: '新增失败', err: e.message })
  }
})

// 2. 查询当前用户的任务列表 GET /api/task/list
router.get('/list', async (req, res) => {
  const list = await Task.findAll({
    where: { userId: req.user.id },
    include: [{ model: User, as: 'user', attributes: ['id', 'username', 'nickName'] }],
    order: [['createdAt', 'DESC']]
  })
  res.json({ code: 200, data: list })
})

// 3. 修改任务 PUT /api/task/:id —— 只能改自己的
router.put('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id)
  if (!task) return res.json({ code: 404, msg: '任务不存在' })
  if (task.userId !== req.user.id) {
    return res.json({ code: 403, msg: '无权操作他人任务' })
  }
  await task.update(req.body)
  res.json({ code: 200, msg: '修改完成' })
})

// 4. 删除任务 DELETE /api/task/:id —— 只能删自己的
router.delete('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id)
  if (!task) return res.json({ code: 404, msg: '任务不存在' })
  if (task.userId !== req.user.id) {
    return res.json({ code: 403, msg: '无权操作他人任务' })
  }
  await task.destroy()
  res.json({ code: 200, msg: '删除完成' })
})

module.exports = router
