/**
 * 我的页面 —— 个人中心
 *
 * 演示知识点:
 * - Image 网络图片加载
 * - 自定义 Hook (useUserProfile)
 * - FlatList 菜单列表渲染
 * - 多种布局技巧（flex, 负边距, 绝对定位）
 * - StyleSheet 复杂样式
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hook
import useUserProfile from '../hooks/useUserProfile';

// 菜单数据
const menuItems = [
  { key: 'profile',   icon: 'document-text',     iconBg: '#1AD1CC', label: '个人资料' },
  { key: 'stats',     icon: 'stats-chart',        iconBg: '#4080FF', label: '数据统计' },
  { key: 'messages', icon: 'chatbubbles',        iconBg: '#FF4444', label: '我的消息' },
  { key: 'settings',  icon: 'settings',           iconBg: '#999999', label: '设置中心' },
  { key: 'help',      icon: 'help-circle-outline', iconBg: '#FF4488', label: '帮助中心' },
];

/**
 * 统计数据行组件
 */
function StatsRow({ data }) {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statNum}>{data.todayPending}</Text>
        <Text style={styles.statLabel}>今日待办</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNum}>{data.totalPublished}</Text>
        <Text style={styles.statLabel}>发布事项</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNum}>{String(data.totalCompleted).padStart(2, '0')}</Text>
        <Text style={styles.statLabel}>已完成事项</Text>
      </View>
    </View>
  );
}

/**
 * 分类卡片组件
 */
function CategoryCards({ categories }) {
  const catData = [
    { key: 'work', label: '工作事项', color: '#4080FF' },
    { key: 'personal', label: '个人事项', color: '#1AD1CC' },
    { key: 'activity', label: '活动事项', color: '#E860E8' },
  ];

  return (
    <View style={styles.catRow}>
      {catData.map(cat => (
        <View key={cat.key} style={[styles.catCard, { backgroundColor: cat.color }]}>
          <Text style={styles.catName}>{cat.label}</Text>
          <Text style={styles.catCount}>
            {categories[cat.key] || 0}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, loading } = useUserProfile();

  /** 菜单项点击 */
  const handleMenuPress = useCallback((key) => {
    Alert.alert('提示', `"${key}" 功能开发中`);
  }, []);

  /** FlatList 渲染菜单项 */
  const renderMenuItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.key)}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={14} color="#FFFFFF" />
      </View>
      <Text style={styles.menuText}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
    </TouchableOpacity>
  ), [handleMenuPress]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== 顶部导航 ====== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的</Text>
          <TouchableOpacity
            style={styles.headerMore}
            onPress={() => Alert.alert('更多', '该功能开发中，敬请期待。')}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.6}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* ====== 用户信息 ====== */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: user?.avatar || 'https://picsum.photos/200/200?random=user' }}
              style={styles.avatarImg}
              resizeMode="cover"
              defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
            />
          </View>
          <View style={styles.userDetail}>
            <Text style={styles.userName}>{user?.name || '加载中...'}</Text>
            <Text style={styles.userId}>ID: {user?.id || '--'}</Text>
          </View>
        </View>

        {/* ====== 统计数据 ====== */}
        {user && <StatsRow data={user.stats} />}

        {/* ====== 分类卡片 ====== */}
        {user && <CategoryCards categories={user.categories} />}

        {/* ====== 菜单列表 ====== */}
        <View style={styles.menuList}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.menuDivider} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,   // 给 Tab Bar 留空间，最后一项「帮助中心」不再被遮
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 20,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerMore: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 用户信息
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginRight: 15,
    backgroundColor: '#EEEEEE',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: '#999999',
  },
  // 统计
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
  },
  statLabel: {
    fontSize: 13,
    color: '#999999',
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  // 分类卡片
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  catCard: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  catName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  catCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  // 菜单
  menuList: {
    marginTop: 10,
    marginHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  menuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 63,
  },
});
