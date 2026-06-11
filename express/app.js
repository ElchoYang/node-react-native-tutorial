const express = require('express');
const cors = require('cors');
// 引入路由
const userRouter = require('./router/user.js');
const taskRouter = require('./router/task.js');
// 引入db（自动建表）
require('./modules/index.js')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({origin: '*'}));

// 挂载接口前缀 /api
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
  res.json({
    code: 200,
    msg: '服务运行中',
    data: {
      name: 'Node+Sequelize+MySQL全栈项目',
      version: '1.0.0'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 服务启动：http://localhost:${PORT}`);
});