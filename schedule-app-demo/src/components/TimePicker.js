/**
 * TimePicker —— 时间下拉选择器
 *
 * 演示知识点:
 * - Modal 弹窗组件
 * - FlatList 高性能列表
 * - 受控组件模式（value + onChange）
 * - 数组生成（按30分钟间隔生成时间槽）
 * - TouchableOpacity 触摸反馈
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * 生成时间选项（00:00 ~ 23:30，每 30 分钟一档）
 */
function buildTimeOptions(stepMinutes = 30) {
  const list = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      list.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      );
    }
  }
  return list;
}

/**
 * @param {string} value - 当前选中时间
 * @param {function} onChange - 选中回调
 * @param {string} placeholder - 占位文案
 * @param {number} stepMinutes - 时间间隔（默认 30 分钟）
 */
function TimePicker({ value, onChange, placeholder = '请选择', stepMinutes = 30, error = false }) {
  const [visible, setVisible] = useState(false);
  const options = useMemo(() => buildTimeOptions(stepMinutes), [stepMinutes]);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const handleSelect = useCallback((t) => {
    onChange && onChange(t);
    setVisible(false);
  }, [onChange]);

  const renderItem = useCallback(({ item }) => {
    const isSelected = item === value;
    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {item}
        </Text>
        {isSelected && <Ionicons name="checkmark" size={18} color="#4080FF" />}
      </TouchableOpacity>
    );
  }, [value, handleSelect]);

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={open}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#999999" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={close}
        >
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>选择时间</Text>
              <TouchableOpacity onPress={close}>
                <Ionicons name="close" size={22} color="#999999" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={renderItem}
              initialNumToRender={12}
              getItemLayout={(_, index) => ({
                length: 44,
                offset: 44 * index,
                index,
              })}
              showsVerticalScrollIndicator
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: '100%',
    height: 48,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  triggerText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholder: {
    color: '#CCCCCC',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '60%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  option: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 15,
    color: '#333333',
  },
  optionTextSelected: {
    color: '#4080FF',
    fontWeight: '500',
  },
});

export default TimePicker;
