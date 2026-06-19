/**
 * 全局通用样式 —— StyleSheet.create 集中管理
 */

import { StyleSheet } from 'react-native';

const GlobalStyles = StyleSheet.create({
  // 页面容器
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // 卡片
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },

  // 头部标题
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },

  // 列表行
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 分割线
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default GlobalStyles;
