/**
 * 任务分类枚举 —— 对应原型中三类：工作、个人、活动
 */

export const CATEGORIES = [
  { key: 'work',     label: '工作', color: '#4080FF' },
  { key: 'personal', label: '个人', color: '#1AD1CC' },
  { key: 'activity', label: '活动', color: '#E860E8' },
];

/**
 * 任务状态枚举
 */
export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

/**
 * 根据分类 key 获取颜色
 */
export const getCategoryColor = (key) => {
  const cat = CATEGORIES.find(c => c.key === key);
  return cat ? cat.color : '#4080FF';
};

/**
 * 根据分类 key 获取标签
 */
export const getCategoryLabel = (key) => {
  const cat = CATEGORIES.find(c => c.key === key);
  return cat ? cat.label : '未分类';
};
