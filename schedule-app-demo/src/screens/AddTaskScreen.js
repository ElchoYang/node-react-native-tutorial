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
 * - useFocusEffect 监听 Tab 切换/聚焦
 * - Alert 提示
 *
 * 作为底部「任务」Tab 直接渲染（无模态导航）。
 */

import React, { useState, useCallback } from 'react';
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

// 组件
import TimePicker from '../components/TimePicker';

// 导入 API
import { createTask } from '../services/api';

/** 今天的 YYYY-MM-DD */
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function AddTaskScreen({ navigation, route }) {
  // 默认日期：路由参数 > 今天
  const initialDate = route?.params?.date || todayKey();

  // ============ useState —— 多个表单字段 ============
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(null);   // 必填 —— 默认未选
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});         // 字段级错误信息

  /** 清除单个字段错误（用户开始修改后即清掉提示） */
  const clearError = useCallback((field) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /** 包装 setter —— 修改字段同时清除该字段错误 */
  const onTitleChange = useCallback((v) => { setTitle(v); clearError('title'); }, [clearError]);
  const onCategoryChange = useCallback((v) => { setCategory(v); clearError('category'); }, [clearError]);
  const onStartTimeChange = useCallback((v) => { setStartTime(v); clearError('startTime'); clearError('time'); }, [clearError]);
  const onEndTimeChange = useCallback((v) => { setEndTime(v); clearError('endTime'); clearError('time'); }, [clearError]);
  const onLocationChange = useCallback((v) => { setLocation(v); clearError('location'); }, [clearError]);

  /** 重置表单字段 */
  const resetForm = useCallback(() => {
    setTitle('');
    setCategory(null);
    setStartTime('');
    setEndTime('');
    setLocation('');
    setNote('');
    setErrors({});
  }, []);

  /** 切换到日历 Tab 并触发刷新 */
  const goToCalendarWithRefresh = useCallback(() => {
    navigation.navigate('日历', { refreshAt: Date.now() });
  }, [navigation]);

  /** 取消按钮：清空表单并跳到日历 */
  const handleCancel = useCallback(() => {
    resetForm();
    navigation.navigate('日历');
  }, [resetForm, navigation]);

  /**
   * 校验所有必填项 —— 一次性收集每个字段的错误信息
   * 演示: 字段级表单校验
   */
  const validate = useCallback(() => {
    const e = {};
    if (!title.trim()) e.title = '请输入任务标题';
    if (!category) e.category = '请选择任务分类';
    if (!startTime.trim()) e.startTime = '请选择开始时间';
    if (!endTime.trim()) e.endTime = '请选择结束时间';
    // 时间逻辑校验：结束 > 开始（仅在两端都填写后判断）
    if (startTime && endTime && endTime <= startTime) {
      e.time = '结束时间必须晚于开始时间';
    }
    if (!location.trim()) e.location = '请输入任务地点';
    return e;
  }, [title, category, startTime, endTime, location]);

  /**
   * 保存任务
   * 演示：输入验证 + async/await + 接口调用
   */
  const handleSave = useCallback(async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // 顶部仍提示总数，引导用户向下查看
      Alert.alert('请检查表单', `还有 ${Object.keys(e).length} 项未填写或不正确`);
      return;
    }
    setErrors({});

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
        // 直接跳回日历（任务列表）页，不再用 Alert 阻塞
        resetForm();
        goToCalendarWithRefresh();
      } else {
        Alert.alert('失败', res.message || '保存失败，请重试');
      }
    } catch (err) {
      Alert.alert('错误', err.message);
    } finally {
      setSubmitting(false);
    }
  }, [validate, title, category, startTime, endTime, location, note, initialDate, resetForm, goToCalendarWithRefresh]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ====== 顶部导航（页面内置） ====== */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerBtnLeft}>
            <Text style={styles.headerBtnText}>取消</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>添加任务</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={submitting}
            style={styles.headerBtnRight}
          >
            <Text style={[styles.headerBtnText, submitting && styles.headerBtnDisabled]}>
              {submitting ? '保存中...' : '完成'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ====== 任务标题 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>
              任务标题 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.formInput, errors.title && styles.formInputError]}
              value={title}
              onChangeText={onTitleChange}     // 受控组件 + 错误清除
              placeholder="请输入任务标题"
              placeholderTextColor="#CCCCCC"
              maxLength={50}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* ====== 任务分类 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>
              任务分类 <Text style={styles.required}>*</Text>
            </Text>
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
                    onPress={() => onCategoryChange(cat.key)}
                  >
                    <Text style={styles.cateText}>{cat.label}</Text>
                    {isSelected && <Text style={styles.cateCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* ====== 时间选择（下拉） ====== */}
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.formLabel}>
                开始时间 <Text style={styles.required}>*</Text>
              </Text>
              <TimePicker
                value={startTime}
                onChange={onStartTimeChange}
                placeholder="选择开始时间"
                error={!!errors.startTime}
              />
              {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.formLabel}>
                结束时间 <Text style={styles.required}>*</Text>
              </Text>
              <TimePicker
                value={endTime}
                onChange={onEndTimeChange}
                placeholder="选择结束时间"
                error={!!errors.endTime}
              />
              {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
            </View>
          </View>
          {errors.time && <Text style={[styles.errorText, styles.errorRow]}>{errors.time}</Text>}

          {/* ====== 任务地点 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>
              任务地点 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.formInput, errors.location && styles.formInputError]}
              value={location}
              onChangeText={onLocationChange}
              placeholder="请输入地点"
              placeholderTextColor="#CCCCCC"
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* ====== 任务备注 ====== */}
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>任务备注</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="请输入备注内容（选填）"
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
  // 顶部导航
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerBtnLeft: {
    minWidth: 50,
    alignItems: 'flex-start',
  },
  headerBtnRight: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  headerBtnText: {
    fontSize: 16,
    color: '#4080FF',
    fontWeight: '500',
  },
  headerBtnDisabled: {
    color: '#A0BFFF',
  },
  // 表单
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
  required: {
    color: '#FF4444',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 6,
  },
  errorRow: {
    marginTop: -10,
    marginBottom: 12,
  },
  formInputError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
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
});
