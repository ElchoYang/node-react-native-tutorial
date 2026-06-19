/**
 * 自定义 Hook: useUserProfile —— 用户资料与统计
 *
 * 演示知识点:
 * - 自定义 Hook 封装复用逻辑
 * - useState + useEffect
 * - 数据缓存的读取
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@schedule_app_user';

export default function useUserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();
      if (res.success) {
        setUser(res.data);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      }
    } catch (err) {
      // 读取本地缓存
      try {
        const cached = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (cached) setUser(JSON.parse(cached));
      } catch (e) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { user, loading, refresh: loadProfile };
}
