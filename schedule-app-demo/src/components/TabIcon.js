/**
 * Tab 导航图标组件 —— 使用 Props 动态渲染
 *
 * 演示知识点:
 * - Props 接收与解构
 * - 条件渲染（三元表达式）
 * - 组件复用
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * TabIcon 组件
 * @param {string} name   - 图标名称
 * @param {boolean} focused - 是否选中状态
 * @param {string} activeColor - 选中颜色
 * @param {string} inactiveColor - 未选中颜色
 * @param {number} size - 图标尺寸
 */
const TabIcon = ({ name, focused, activeColor = '#4080FF', inactiveColor = '#999999', size = 22 }) => {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={focused ? activeColor : inactiveColor}
    />
  );
};

export default TabIcon;
