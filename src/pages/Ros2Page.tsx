import React, { useState } from 'react';
import { ros2Api } from '../api/ros2';

export default function Ros2Page() {
  const [message, setMessage] = useState('');
  const [pvcname, setPvcname] = useState('');

  // 通用呼叫函式
  const handleApi = async (fn: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setMessage('處理中...');
    try {
      const res = await fn(...args);
      setMessage(res.message || '成功');
    } catch (e: any) {
      setMessage(e.message || '發生錯誤');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>ROS2 控制面板</h2>
      <div>
        <button onClick={() => handleApi(ros2Api.createDiscovery)}>建立 Discovery</button>
        <button onClick={() => handleApi(ros2Api.deleteDiscovery)}>刪除 Discovery</button>
      </div>
      <div>
        <input
          placeholder="PVC 名稱"
          value={pvcname}
          onChange={e => setPvcname(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={() => handleApi(ros2Api.createSlamUnity, pvcname)}>建立 SLAM Unity</button>
        <button onClick={() => handleApi(ros2Api.deleteSlamUnity)}>刪除 SLAM Unity</button>
      </div>
      <div>
        <button onClick={() => handleApi(ros2Api.storeMap)}>儲存地圖</button>
      </div>
      <div>
        <button onClick={() => handleApi(ros2Api.createLocalization, pvcname)}>建立 Localization</button>
        <button onClick={() => handleApi(ros2Api.deleteLocalization)}>刪除 Localization</button>
      </div>
      <div>
        <button onClick={() => handleApi(ros2Api.createCarControl, pvcname)}>建立車控</button>
        <button onClick={() => handleApi(ros2Api.deleteCarControl)}>刪除車控</button>
      </div>
      <div>
        <button onClick={() => handleApi(ros2Api.createYolo, pvcname)}>建立 YOLO</button>
        <button onClick={() => handleApi(ros2Api.deleteYolo)}>刪除 YOLO</button>
      </div>
      <div style={{ marginTop: 20, color: 'green' }}>{message}</div>
    </div>
  );
}
