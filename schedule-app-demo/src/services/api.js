/**
 * 模拟后端 API 服务 —— 使用 setTimeout 模拟网络延迟
 *
 * 演示知识点:
 * - async/await 异步编程
 * - Promise 封装
 * - RESTful 接口风格
 * - axios / fetch 对接（示例中同时展示两种方式）
 *
 * 实际项目中将 BASE_URL 替换为真实后端地址即可
 */

import axios from 'axios';

// ============ 配置 ============

// 模拟模式：无需后端也可运行
const USE_MOCK = true;

// 真实后端地址（联调时替换）
const BASE_URL = 'http://localhost:3000/api';

// 模拟延迟时间（毫秒）
const MOCK_DELAY = 500;

// ============ 模拟数据 ============

let mockTasks = [
  {
    id: '1',
    title: '公司年终复盘会议',
    category: 'work',
    startTime: '08:00',
    endTime: '10:00',
    location: '',
    note: '准备年终总结PPT',
    date: '2026-06-13',
    status: 'pending',
    createdAt: '2026-06-12T08:00:00Z',
  },
  {
    id: '2',
    title: '部门年终总结分享会',
    category: 'work',
    startTime: '10:30',
    endTime: '12:00',
    location: '',
    note: '',
    date: '2026-06-13',
    status: 'pending',
    createdAt: '2026-06-12T08:00:00Z',
  },
  {
    id: '3',
    title: '广州插画分享会',
    category: 'activity',
    startTime: '14:00',
    endTime: '16:00',
    location: '西西弗书店',
    note: '带上速写本',
    date: '2026-06-13',
    status: 'pending',
    createdAt: '2026-06-12T08:00:00Z',
  },
  {
    id: '4',
    title: '下班配钥匙',
    category: 'personal',
    startTime: '18:30',
    endTime: '',
    location: '下沙市场',
    note: '',
    date: '2026-06-13',
    status: 'pending',
    createdAt: '2026-06-12T08:00:00Z',
  },
  {
    id: '5',
    title: '提交项目报告',
    category: 'work',
    startTime: '09:00',
    endTime: '11:00',
    location: '',
    note: '需要部门经理审核',
    date: '2026-06-14',
    status: 'completed',
    createdAt: '2026-06-11T08:00:00Z',
  },
];

let mockIdCounter = 6;

// 模拟用户数据
const mockUser = {
  id: '58465',
  name: '张同学',
  avatar: 'https://picsum.photos/200/200?random=user',
  stats: {
    todayPending: 3,
    totalPublished: 73,
    totalCompleted: 9,
  },
  categories: {
    work: 258,
    personal: 128,
    activity: 89,
  },
};

// ============ 工具函数 ============

/** 模拟网络延迟 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** 统一响应格式 */
const formatResponse = (success, data, message = '') => ({
  success,
  data,
  message,
});

// ============ API 接口 ============

/**
 * 方式一：使用 fetch（React Native 内置）
 */
export const fetchTasks = async (date) => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    let tasks = [...mockTasks];
    if (date) {
      tasks = tasks.filter(t => t.date === date);
    }
    return formatResponse(true, tasks);
  }
  // 真实请求
  const response = await fetch(`${BASE_URL}/tasks${date ? `?date=${date}` : ''}`);
  const data = await response.json();
  return data;
};

/**
 * 方式二：使用 axios（推荐，支持拦截器等高级功能）
 */
export const api = axios.create({
  baseURL: USE_MOCK ? '' : BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios 请求拦截器 —— 自动附加 token
api.interceptors.request.use(
  (config) => {
    // 实际项目中从 AsyncStorage 读取 token
    // const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// axios 响应拦截器 —— 统一错误处理
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('[API Error]', error.message);
    return formatResponse(false, null, error.message);
  }
);

// ============ 任务相关接口 ============

/** 获取任务列表（axios 版） */
export const getTasks = async (date) => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    let tasks = [...mockTasks];
    if (date) {
      tasks = tasks.filter(t => t.date === date);
    }
    // 按开始时间排序
    tasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return formatResponse(true, tasks);
  }
  try {
    const res = await api.get('/tasks', { params: { date } });
    return res;
  } catch (err) {
    return formatResponse(false, null, err.message);
  }
};

/** 添加任务 */
export const createTask = async (taskData) => {
  if (USE_MOCK) {
    await delay(MOCK_DELAY);
    const newTask = {
      ...taskData,
      id: String(mockIdCounter++),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    return formatResponse(true, newTask, '任务创建成功');
  }
  try {
    const res = await api.post('/tasks', taskData);
    return res;
  } catch (err) {
    return formatResponse(false, null, err.message);
  }
};

/** 更新任务状态 */
export const updateTaskStatus = async (taskId, status) => {
  if (USE_MOCK) {
    await delay(200);
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      return formatResponse(true, task);
    }
    return formatResponse(false, null, '任务不存在');
  }
  try {
    const res = await api.put(`/tasks/${taskId}`, { status });
    return res;
  } catch (err) {
    return formatResponse(false, null, err.message);
  }
};

/** 删除任务 */
export const deleteTask = async (taskId) => {
  if (USE_MOCK) {
    await delay(200);
    mockTasks = mockTasks.filter(t => t.id !== taskId);
    return formatResponse(true, null, '删除成功');
  }
  try {
    const res = await api.delete(`/tasks/${taskId}`);
    return res;
  } catch (err) {
    return formatResponse(false, null, err.message);
  }
};

// ============ 用户相关接口 ============

/** 获取用户信息 */
export const getUserProfile = async () => {
  if (USE_MOCK) {
    await delay(300);
    return formatResponse(true, mockUser);
  }
  try {
    const res = await api.get('/user/profile');
    return res;
  } catch (err) {
    return formatResponse(false, null, err.message);
  }
};
