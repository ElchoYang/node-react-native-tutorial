/**
 * App.js —— 应用入口
 *
 * 演示知识点:
 * - React 组件定义（函数式组件）
 * - NavigationContainer 嵌套
 * - StatusBar 状态栏配置
 * - SafeAreaView 安全区域适配
 * - 导航体系挂载
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 导入导航容器
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 全局状态栏配置 */}
      <StatusBar barStyle="dark-content" />

      {/* 导航容器 —— 整个 APP 的路由入口 */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}
