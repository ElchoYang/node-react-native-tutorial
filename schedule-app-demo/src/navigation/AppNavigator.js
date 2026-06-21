/**
 * 应用导航体系 —— React Navigation 配置
 *
 * 演示知识点:
 * - @react-navigation/native NavigationContainer
 * - @react-navigation/bottom-tabs createBottomTabNavigator
 * - tabBarOptions / screenOptions 配置
 * - headerShown 控制顶部导航栏
 *
 * 与原型对应:
 *  - 「任务」Tab → 添加任务页 AddTaskScreen
 *  - 「日历」Tab → 任务列表页 TaskListScreen（带日期切换）
 *  - 「通讯」Tab → 通讯录 ContactsScreen
 *  - 「我的」Tab → ProfileScreen
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 自定义 Tab 图标组件
import TabIcon from '../components/TabIcon';

// 页面组件
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ContactsScreen from '../screens/ContactsScreen';

// ============ 底部 Tab 导航器 ============

const Tab = createBottomTabNavigator();

/**
 * BottomTabNavigator —— 底部标签导航
 * 4个标签：任务 / 日历 / 通讯 / 我的
 */
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="日历"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          // 根据路由名称匹配图标
          let iconName;
          switch (route.name) {
            case '任务':
              iconName = 'checkbox';
              break;
            case '日历':
              iconName = 'calendar';
              break;
            case '通讯':
              iconName = 'search';
              break;
            case '我的':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }
          return <TabIcon name={iconName} focused={focused} />;
        },
        tabBarActiveTintColor: '#4080FF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          height: 60,
          borderTopColor: '#F0F0F0',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false, // 不显示顶部导航栏，页面内部自定义
      })}
    >
      <Tab.Screen name="任务" component={AddTaskScreen} />
      <Tab.Screen name="日历" component={TaskListScreen} />
      <Tab.Screen name="通讯" component={ContactsScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * AppNavigator —— 整体导航容器
 */
function AppNavigator() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

export default AppNavigator;
