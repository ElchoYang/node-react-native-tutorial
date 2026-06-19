/**
 * 日历页面 —— Tab 占位页
 *
 * 演示知识点:
 * - 简单页面骨架
 * - SafeAreaView + StatusBar
 * - Flexbox 居中布局
 * - 占位提示 + 主题色
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';

/**
 * 计算当前月份的简单日历（演示数组生成与列表渲染）
 */
function buildCalendarGrid() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  return { year, month: month + 1, today, cells };
}

export default function CalendarScreen() {
  const { year, month, today, cells } = useMemo(buildCalendarGrid, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>日历</Text>
        </View>

        {/* 月份标题 */}
        <View style={styles.monthBar}>
          <Text style={styles.monthText}>{year} 年 {month} 月</Text>
        </View>

        {/* 星期标签 */}
        <View style={styles.weekRow}>
          {['日', '一', '二', '三', '四', '五', '六'].map(w => (
            <Text key={w} style={styles.weekLabel}>{w}</Text>
          ))}
        </View>

        {/* 日历格子 */}
        <View style={styles.grid}>
          {cells.map((day, idx) => (
            <View key={idx} style={styles.cell}>
              {day !== null && (
                <View style={[styles.dayBox, day === today && styles.dayToday]}>
                  <Text style={[styles.dayText, day === today && styles.dayTextToday]}>
                    {day}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.tipBox}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.textHint} />
          <Text style={styles.tipText}>点击「任务」标签查看具体日程</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  monthBar: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textHint,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToday: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dayTextToday: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  tipText: {
    marginLeft: 6,
    fontSize: 13,
    color: Colors.textHint,
  },
});
