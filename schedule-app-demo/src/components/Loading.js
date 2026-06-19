/**
 * Loading 组件 —— 数据加载中的骨架屏
 *
 * 演示知识点:
 * - ActivityIndicator RN 内置组件
 * - View 容器布局
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

function Loading({ message = '加载中...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4080FF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#999999',
  },
});

export default Loading;
