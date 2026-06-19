/**
 * 任务列表项组件 —— 单条日程卡片
 *
 * 演示知识点:
 * - 组件拆分与复用
 * - TouchableOpacity 触摸事件
 * - View/Text/Image/Button 基础组件
 * - StyleSheet 样式
 * - Props 解构默认值
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryColor, getCategoryLabel } from '../constants/categories';

/**
 * ScheduleItem 组件
 * @param {object} task - 任务数据对象
 * @param {function} onToggle - 切换完成状态回调
 * @param {function} onPress - 点击查看详情回调
 */
function ScheduleItem({ task, onToggle, onPress }) {
  const dotColor = getCategoryColor(task.category);
  const isCompleted = task.status === 'completed';

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completed]}
      onPress={() => onPress && onPress(task)}
      activeOpacity={0.7}
    >
      {/* 左侧：分类色点 + 状态切换按钮 */}
      <TouchableOpacity onPress={() => onToggle && onToggle(task.id)} style={styles.checkWrapper}>
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={22} color="#34D399" />
        ) : (
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        )}
      </TouchableOpacity>

      {/* 中间：内容区 */}
      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          #{getCategoryLabel(task.category)}
          {task.location ? `  ${task.location}` : ''}
        </Text>
      </View>

      {/* 右侧：时间 */}
      <Text style={[styles.time, isCompleted && styles.timeCompleted]}>
        {task.startTime}
        {task.endTime ? `-${task.endTime}` : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  completed: {
    opacity: 0.6,
  },
  checkWrapper: {
    marginRight: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  meta: {
    fontSize: 13,
    color: '#999999',
  },
  time: {
    fontSize: 14,
    color: '#666666',
    flexShrink: 0,
    marginLeft: 10,
  },
  timeCompleted: {
    color: '#BBBBBB',
  },
});

export default ScheduleItem;
