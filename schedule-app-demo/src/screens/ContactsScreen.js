/**
 * 通讯页面 —— Tab 占位页
 *
 * 演示知识点:
 * - FlatList 渲染联系人列表
 * - Image + 头像占位
 * - SectionList 替代品（按字母分组的简单实现）
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';

const mockContacts = [
  { id: '1', name: '张同学', desc: '产品经理', avatar: 'https://picsum.photos/200/200?random=11' },
  { id: '2', name: '李设计', desc: 'UI 设计师', avatar: 'https://picsum.photos/200/200?random=12' },
  { id: '3', name: '王开发', desc: '前端工程师', avatar: 'https://picsum.photos/200/200?random=13' },
  { id: '4', name: '赵后端', desc: 'Node.js 开发', avatar: 'https://picsum.photos/200/200?random=14' },
  { id: '5', name: '钱测试', desc: 'QA', avatar: 'https://picsum.photos/200/200?random=15' },
  { id: '6', name: '孙运营', desc: '运营专员', avatar: 'https://picsum.photos/200/200?random=16' },
];

function ContactItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => onPress(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
    </TouchableOpacity>
  );
}

export default function ContactsScreen() {
  const data = useMemo(() => mockContacts, []);

  const handlePress = (c) => {
    Alert.alert('联系人', `${c.name} (${c.desc})`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactItem item={item} onPress={handlePress} />}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  listContent: { paddingTop: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#EEE',
  },
  info: { flex: 1 },
  name: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
  desc: { fontSize: 13, color: Colors.textHint, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 72 },
});
