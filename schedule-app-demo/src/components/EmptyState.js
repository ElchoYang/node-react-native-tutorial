/**
 * EmptyState 空状态组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function EmptyState({ message = '暂无任务', icon = 'calendar-outline' }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color="#CCCCCC" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: '#999999',
  },
});

export default EmptyState;
