/**
 * 添加任务页面 —— 表单开发
 *
 * 演示知识点:
 * - useState 表单状态管理（受控组件）
 * - TextInput 文本输入 + 数据绑定
 * - KeyboardAvoidingView 键盘避让
 * - 输入验证
 * - ScrollView 表单滚动
 * - TouchableOpacity 分类选择
 * - navigation.goBack() 返回上一页
 * - route.params 接收页面参数
 * - Alert 提示
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// 常量
import { CATEGORIES, getCategoryColor } from '../constants/categories';

// 导入 API
import { createTask } from '../services/api';

export default function AddTaskScreen({ navigation, route }) {
  // 从路由参数获取默认日期
  const initialDate = route.params?.date || new Date().toISOString().slice(0, 10);

  // ============ useState —— 多个表单字段 ============
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /**
   * 保存任务
   * 演示：输入验证 + async/await + 接口调用
   */
  const handleSave = useCallback(async () => {
    // 输入验证
    if (!title.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }
    if (!startTime.trim()) {
      Alert.alert('提示', '请输入开始时间');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTask({
        title: title.trim(),
        category,
        startTime,
        endTime: endTime.trim(),
        location: location.trim(),
        note: note.trim(),
        date: initialDate,
      });

      if (res.success) {
        Alert.alert('成功', '任务保存成功！', [
          {
            text: '好的',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('失败', res.message || '保存失败，请重试');
      }
    } catch (err) {
      Alert.alert('错误', err.message);
    } finally {
      setSubmitting(false);
    }
  }, [title, category, startTime, endTime, location, note, initialDate, navigation]);

  /**
   * 右上角保存按钮
   */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={submitting}
          style={styles.headerBtn}
        >
          <Text style={[styles.headerBtnText, submitting && styles.headerBtnDisabled]}>
            {submitting ? '保存中...' : '完成'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave, submitting]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ====== 任务标题 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>任务标题</Text>
            <TextInput
              style={styles.formInput}
              value={title}
              onChangeText={setTitle}      // 受控组件 —— value + onChangeText 数据绑定
              placeholder="请输入任务标题"
              placeholderTextColor="#CCCCCC"
              maxLength={50}
              autoFocus                  // 自动聚焦
            />
          </View>

          {/* ====== 任务分类 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>任务分类</Text>
            <View style={styles.cateGroup}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.cateItem,
                      { backgroundColor: getCategoryColor(cat.key) },
                      // 条件样式 —— 选中态
                      isSelected && styles.cateItemSelected,
                    ]}
                    onPress={() => setCategory(cat.key)}
                  >
                    <Text style={styles.cateText}>{cat.label}</Text>
                    {isSelected && (
                      <Text style={styles.cateCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ====== 时间选择 ====== */}
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.formLabel}>开始时间</Text>
              <TextInput
                style={styles.formInput}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="08:00"
                placeholderTextColor="#CCCCCC"
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.formLabel}>结束时间</Text>
              <TextInput
                style={styles.formInput}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="10:00"
                placeholderTextColor="#CCCCCC"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* ====== 任务地点 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>任务地点</Text>
            <TextInput
              style={styles.formInput}
              value={location}
              onChangeText={setLocation}
              placeholder="请输入地点"
              placeholderTextColor="#CCCCCC"
            />
          </View>

          {/* ====== 任务备注 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>任务备注</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="请输入备注内容"
              placeholderTextColor="#CCCCCC"
              multiline               // 多行输入
              textAlignVertical="top"
              numberOfLines={4}
            />
          </View>

          {/* ====== 保存按钮 ====== */}
          <TouchableOpacity
            style={[styles.saveBtn, submitting && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={submitting}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {submitting ? '保存中...' : '保存任务'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formItem: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  formInput: {
    width: '100%',
    height: 48,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  // 分类选择
  cateGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  cateItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    opacity: 0.6,
  },
  cateItemSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cateText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cateCheck: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 14,
    color: '#FFFFFF',
  },
  // 时间行
  timeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  timeItem: {
    flex: 1,
  },
  // 保存按钮
  saveBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#4080FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnDisabled: {
    backgroundColor: '#A0BFFF',
  },
  saveBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // 顶部按钮
  headerBtn: {
    marginRight: 15,
  },
  headerBtnText: {
    fontSize: 16,
    color: '#4080FF',
    fontWeight: '500',
  },
  headerBtnDisabled: {
    color: '#A0BFFF',
  },
});
