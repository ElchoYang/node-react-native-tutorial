/**
 * 自定义 Hook: useTasks —— 任务列表状态管理
 *
 * 演示知识点:
 * - useState 管理状态
 * - useEffect 副作用（数据加载、监听变化）
 * - useCallback 缓存回调函数
 * - async/await 在组件中使用
 * - Loading 状态处理
 */

import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@schedule_app_tasks';

/**
 * useTasks 自定义 Hook
 * @param {string} selectedDate - 当前选中的日期（格式 YYYY-MM-DD）
 * @returns {object} - { tasks, loading, error, addTask, toggleStatus, removeTask, refresh }
 */
export default function useTasks(selectedDate) {
  // useState —— 定义多个状态变量
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 加载任务列表
   * 使用 useCallback 缓存，避免不必要的重新创建
   */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks(selectedDate);
      if (res.success) {
        setTasks(res.data);
        // 持久化到 AsyncStorage
        try {
          await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(res.data));
        } catch (e) {
          console.warn('AsyncStorage 写入失败:', e);
        }
      } else {
        setError(res.message || '加载失败');
      }
    } catch (err) {
      setError(err.message);
      // 加载失败时尝试从本地缓存恢复
      try {
        const cached = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (cached) {
          setTasks(JSON.parse(cached));
        }
      } catch (e) {
        console.warn('缓存恢复失败:', e);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  /**
   * useEffect —— 日期变化时自动重新加载
   * 依赖数组 [loadTasks] 表示 loadTasks 变化时才重新执行
   */
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * 添加新任务
   */
  const addTask = useCallback(async (taskData) => {
    const res = await createTask(taskData);
    if (res.success) {
      // 乐观更新：先更新本地状态
      setTasks(prev => [...prev, res.data]);
      return { success: true };
    }
    return { success: false, message: res.message };
  }, []);

  /**
   * 切换任务完成状态
   */
  const toggleStatus = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const res = await updateTaskStatus(taskId, newStatus);
    if (res.success) {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    }
  }, [tasks]);

  /**
   * 删除任务
   */
  const removeTask = useCallback(async (taskId) => {
    const res = await deleteTask(taskId);
    if (res.success) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleStatus,
    removeTask,
    refresh: loadTasks, // 暴露刷新方法
  };
}
