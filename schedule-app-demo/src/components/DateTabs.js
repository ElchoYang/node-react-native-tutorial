/**
 * 日期标签组件 —— 水平滚动的日期选择器
 *
 * 演示知识点:
 * - Props 接收（数组数据和选中回调）
 * - 列表渲染 (.map)
 * - 条件样式（选中态高亮）
 * - StyleSheet inline 动态样式
 */

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';

/**
 * DateTabs 组件
 * @param {Array} dates - 日期数据数组
 * @param {string} selectedDate - 当前选中日期
 * @param {function} onSelect - 选中回调
 */
function DateTabs({ dates = [], selectedDate = '', onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((item, index) => {
        const isSelected = item.date === selectedDate;
        // 第一项或月份与上一项不同时显示月份标签
        const showMonth = index === 0 || dates[index - 1].month !== item.month;

        return (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.tabItem,
              // 条件渲染 —— 选中态切换背景色
              isSelected && styles.tabItemActive,
            ]}
            onPress={() => onSelect && onSelect(item.date)}
            activeOpacity={0.7}
          >
            {showMonth ? (
              <Text style={[styles.monthLabel, isSelected && styles.textWhite]}>
                {item.month}
              </Text>
            ) : (
              <View style={styles.monthPlaceholder} />
            )}
            <Text
              style={[
                styles.weekDay,
                isSelected && styles.textWhite,
              ]}
            >
              {item.weekDay}
            </Text>
            <Text
              style={[
                styles.dayNum,
                isSelected && styles.textWhite,
              ]}
            >
              {item.day}
            </Text>
            {/* 今天小圆点提示 */}
            {item.isToday && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    minWidth: 52,
    minHeight: 64,                 // 固定最小高度，避免活动态高度坍缩
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 3,
  },
  tabItemActive: {
    backgroundColor: '#4080FF',
    shadowColor: 'rgba(64, 128, 255, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  monthPlaceholder: {
    height: 14,
    marginBottom: 2,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4080FF',
    marginTop: 3,
  },
  weekDay: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  textWhite: {
    color: '#FFFFFF',
  },
});

export default DateTabs;
