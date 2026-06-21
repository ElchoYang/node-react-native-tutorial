/**
 * 任务列表页面 —— APP 主页
 *
 * 演示知识点:
 * - 自定义 Hook 使用 (useTasks)
 * - FlatList 高性能列表渲染
 * - useEffect 监听数据变化
 * - navigation.navigate 页面跳转
 * - 日期计算与格式化
 * - 条件渲染（Loading / Empty / 列表）
 * - Flexbox 布局（flexDirection, justifyContent, alignItems）
 * - ScrollView + RefreshControl 下拉刷新
 * - Alert 弹窗
 * - StatusBar 状态栏
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 组件
import DateTabs from '../components/DateTabs';
import ScheduleItem from '../components/ScheduleItem';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

// Hook
import useTasks from '../hooks/useTasks';

/**
 * 生成最近7天的日期数据
 * 演示知识点: Date 对象、数组生成、字符串格式化
 */
function generateWeekDates() {
  const dates = [];
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const todayKey = (() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  })();
  // 显示前2天 + 今天 + 后4天 = 7天
  for (let i = -2; i <= 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    dates.push({
      date: dateKey,
      month: monthLabels[d.getMonth()],
      weekDay: weekDays[d.getDay()],
      day: d.getDate(),
      isToday: dateKey === todayKey,
      fullLabel: `星期${weekDays[d.getDay()]} ${year}/${month}/${day}`,
    });
  }
  return dates;
}

export default function TaskListScreen({ navigation, route }) {
  const weekDates = useMemo(() => generateWeekDates(), []);
  const today = useMemo(
    () => weekDates.find(d => d.isToday)?.date || weekDates[2].date,
    [weekDates]
  );

  const [selectedDate, setSelectedDate] = useState(today);
  const selectedDateInfo = weekDates.find(d => d.date === selectedDate) || weekDates[2];
  const isTodaySelected = selectedDate === today;

  // 使用自定义 Hook 管理任务状态
  const { tasks, loading, addTask, toggleStatus, removeTask, refresh } = useTasks(selectedDate);

  /**
   * useEffect —— 监听 AddTask 页面回传的刷新信号
   * 演示: route.params 与 useFocusEffect 替代写法
   */
  useEffect(() => {
    if (route?.params?.refreshAt) {
      refresh();
      // 清空参数避免重复触发
      navigation.setParams({ refreshAt: undefined });
    }
  }, [route?.params?.refreshAt, refresh, navigation]);

  /**
   * FlatList 的 renderItem —— 每个列表项的渲染函数
   * 接收 { item, index } 参数
   */
  const renderItem = useCallback(({ item }) => (
    <ScheduleItem
      task={item}
      onToggle={toggleStatus}
      onDelete={removeTask}
      onPress={(task) => {
        // 点击主体显示任务详情
        const content = [
          `分类: #${task.category}`,
          `时间: ${task.startTime}${task.endTime ? '-' + task.endTime : ''}`,
          task.location ? `地点: ${task.location}` : null,
          task.note ? `备注: ${task.note}` : null,
        ].filter(Boolean).join('\n');
        Alert.alert(task.title, content || '无更多信息');
      }}
    />
  ), [toggleStatus, removeTask]);

  /**
   * FlatList key 提取器 —— 必须为每项提供唯一 key
   */
  const keyExtractor = useCallback((item) => item.id, []);

  /** 跳转到「任务」Tab（添加任务页） */
  const goToAddTask = useCallback(() => {
    navigation.navigate('任务', { date: selectedDate });
  }, [navigation, selectedDate]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* ====== 顶部导航 ====== */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('菜单', '功能开发中')}>
            <Ionicons name="menu" size={22} color="#333333" />
          </TouchableOpacity>
          {/* 条件渲染: 今天显示"今天"，其他显示日期 */}
          <TouchableOpacity onPress={() => setSelectedDate(today)} activeOpacity={0.7}>
            <Text style={styles.headerTitle}>
              {isTodaySelected ? '今天' : selectedDateInfo.fullLabel.split(' ')[0]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('搜索', '功能开发中')}>
            <Ionicons name="search" size={22} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* ====== 日期标签（DateTabs 组件） ====== */}
        <DateTabs
          dates={weekDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {/* ====== 日期标题 ====== */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{selectedDateInfo.fullLabel}</Text>
        </View>

        {/* ====== 任务列表 ====== */}
        {/* 条件渲染：loading → empty → list */}
        {loading && tasks.length === 0 ? (
          <Loading message="加载任务中..." />
        ) : tasks.length === 0 ? (
          <EmptyState message="今天没有安排任务" />
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
            // 下拉刷新
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refresh}
                colors={['#4080FF']}
                tintColor="#4080FF"
              />
            }
            // 性能优化
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            initialNumToRender={6}
          />
        )}

        {/* ====== 悬浮添加按钮 ====== */}
        <TouchableOpacity style={styles.addBtn} onPress={goToAddTask} activeOpacity={0.8}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ====== StyleSheet 样式 ======

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',       // Flexbox: 水平排列
    justifyContent: 'space-between', // 两端对齐
    alignItems: 'center',         // 垂直居中
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F5F7FA',
  },
  dayHeaderText: {
    fontSize: 15,
    color: '#666666',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 140, // 给悬浮按钮留空间
  },
  addBtn: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    marginLeft: -30,  // 居中对齐（按钮宽60，偏移一半）
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4080FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(64, 128, 255, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
});
