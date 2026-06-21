/**
 * App.js —— 应用入口
 *
 * 演示知识点:
 * - React 组件定义（函数式组件）
 * - NavigationContainer 嵌套
 * - StatusBar 状态栏配置
 * - SafeAreaView 安全区域适配
 * - 导航体系挂载
 * - Platform 判断 + web 端样式注入
 */

import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 导入导航容器
import AppNavigator from './src/navigation/AppNavigator';

// 在 web 上去除原生 button 的 focus outline 与点击高亮，避免与移动端体验差异
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    * { -webkit-tap-highlight-color: transparent; }
    *:focus, *:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
    [role="button"], button { outline: none !important; }
  `;
  document.head.appendChild(styleEl);
}

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
