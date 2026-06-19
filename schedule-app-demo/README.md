# 日程管理 APP —— 阶段作业2示范项目

## 项目概述

基于 **React Native 0.81 + Expo SDK 54 + React 19** 的日程管理移动应用，对应课程 Day2 阶段作业2 的全部要求，原型源自 `阶段作业/1.页面原型`。

## 项目结构

```
schedule-app-demo/
├── App.js                          # 应用入口
├── app.json                        # Expo 配置
├── package.json                    # 依赖管理
├── babel.config.js                  # Babel 配置
├── assets/                         # 静态资源
└── src/
    ├── constants/                   # 常量定义
    │   ├── colors.js               # 全局颜色
    │   ├── styles.js               # 通用样式
    │   └── categories.js          # 分类枚举
    ├── navigation/                 # 导航配置
    │   └── AppNavigator.js         # Tab + Stack 导航
    ├── screens/                    # 页面组件
    │   ├── TaskListScreen.js       # 任务列表页（首页）
    │   ├── AddTaskScreen.js        # 添加任务页（表单）
    │   ├── CalendarScreen.js       # 日历页（Tab）
    │   ├── ContactsScreen.js       # 通讯页（Tab）
    │   └── ProfileScreen.js        # 我的页面
    ├── components/                 # 通用组件
    │   ├── TabIcon.js             # Tab 图标
    │   ├── DateTabs.js            # 日期选择器
    │   ├── ScheduleItem.js        # 任务列表项
    │   ├── Loading.js             # 加载组件
    │   └── EmptyState.js          # 空状态组件
    ├── hooks/                      # 自定义 Hooks
    │   ├── useTasks.js            # 任务状态管理
    │   └── useUserProfile.js      # 用户状态管理
    ├── services/                   # 服务层
    │   └── api.js                 # API 接口（模拟+真实）
    └── store/                      # 状态存储（预留）
```

## 作业覆盖清单

### 1. 完成APP的底部导航
- 文件：`src/navigation/AppNavigator.js`
- 技术：`@react-navigation/bottom-tabs` createBottomTabNavigator
- 功能：4个Tab（任务/日历/通讯/我的），自定义图标，选中高亮

### 2. Todo-list 首页
- 文件：`src/screens/TaskListScreen.js`
- 技术：FlatList、DateTabs、RefreshControl
- 功能：日期选择、任务列表、下拉刷新、完成切换

### 3. 任务列表和添加任务
- 文件：`src/screens/TaskListScreen.js` + `AddTaskScreen.js`
- 技术：Stack Navigation (modal)、TextInput、KeyboardAvoidingView
- 功能：表单输入、分类选择、输入验证、保存提交

### 4. 我的页面
- 文件：`src/screens/ProfileScreen.js`
- 技术：Image、FlatList 菜单、统计数据
- 功能：头像、统计、分类卡片、菜单列表

### 5. 前后端内容的联调
- 文件：`src/services/api.js`
- 技术：fetch、axios、interceptors、async/await
- 功能：模拟API + 真实API切换、请求/响应拦截器

## 核心技术知识点覆盖

| 知识点 | 对应文件 | 说明 |
|--------|---------|------|
| JSX 语法 | 所有组件 | 模板语法、表达式插值 |
| Props/State | ScheduleItem, DateTabs | 组件通信、状态管理 |
| Hooks (useState) | 所有页面 | 多状态表单管理 |
| Hooks (useEffect) | useTasks, useUserProfile | 副作用、数据加载 |
| Hooks (useCallback) | TaskListScreen | 性能优化、函数缓存 |
| Hooks (useMemo) | TaskListScreen | 计算缓存 |
| 条件渲染 | 所有页面 | 三元表达式、&& 短路 |
| 列表渲染 | FlatList, DateTabs | .map + key |
| View/Text/Image/Button | 所有页面 | RN 基础组件 |
| StyleSheet | 所有页面 | 样式定义、动态样式 |
| Flexbox 布局 | 所有页面 | flex, flexDirection, justifyContent, alignItems |
| TextInput | AddTaskScreen | 受控组件、数据绑定、输入验证 |
| fetch / axios | api.js | 两种请求方式对比 |
| async/await | api.js, hooks | 异步流程处理 |
| React Navigation | AppNavigator.js | 底部Tab + 模态Stack |
| AsyncStorage | useTasks | 状态持久化 |
| Loading 处理 | Loading.js | 加载态组件 |
| Alert 弹窗 | TaskListScreen | 系统弹窗 |
| RefreshControl | TaskListScreen | 下拉刷新 |

## 快速启动

> 已升级到 **Expo SDK 54**（React Native 0.81 + React 19）。如果之前装过旧的 `node_modules`，请先删除再重新安装。

```bash
# 1. 进入项目目录
cd schedule-app-demo

# 2. 清理旧的依赖（仅升级时需要）
rm -rf node_modules package-lock.json   # Windows: rmdir /s /q node_modules && del package-lock.json

# 3. 安装依赖
npm install

# 4. 校准与 SDK 54 兼容的版本（推荐）
npx expo install --fix

# 5. 启动 Expo
npx expo start

# 6. 扫描二维码在手机上运行（需要安装 Expo Go SDK 54 版本）
# 或按 'a' 启动 Android 模拟器
# 或按 'i' 启动 iOS 模拟器
# 或按 'w' 在浏览器查看 web 版
```

> ⚠️ Expo Go 在每次大版本升级后需更新到对应 SDK 版本。手机端如果是旧版 Expo Go，请先到应用商店升级。

## 联调后端

修改 `src/services/api.js` 中 `USE_MOCK` 为 `false`，将 `BASE_URL` 替换为你的后端地址即可切换到真实 API 模式。

后端 API 接口规范：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks?date=2026-06-13 | 获取指定日期的任务列表 |
| POST | /api/tasks | 创建新任务 |
| PUT | /api/tasks/:id | 更新任务（状态） |
| DELETE | /api/tasks/:id | 删除任务 |
| GET | /api/user/profile | 获取用户信息 |
