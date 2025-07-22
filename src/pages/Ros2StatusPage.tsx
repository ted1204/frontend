// src/pages/Ros2StatusPage.tsx
import React from 'react';
import Ros2StatusList from '../components/Ros2StatusList';

export default function Ros2StatusPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ROS2 模組狀態總覽</h1>
      <Ros2StatusList />
    </div>
  );
}
