import React, { useState } from 'react';
import { ros2Api } from '../api/ros2';
import XtermTerminal from '../components/XtermTerminal';
import styles from '../styles/Ros2Page.module.css'; // 引入 CSS Modules

export default function Ros2Page() {
  const [message, setMessage] = useState('');
  const [pvcname, setPvcname] = useState('');
  const [podName, setPodName] = useState<string | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);

  const backendWsBase = 'ws://localhost:30000'; // 後端 WS 服務地址
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTE5ODA2NjAsImV4cCI6MTc1MjA2NzA2MH0.GOaiTtrUiDFGag7xAPbZdLpgBhahGZIPt1b4xGs666Q'; // 請改成你的 token 來源

  // 通用 API 呼叫函式
  const handleApi = async (fn: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setMessage('處理中...');
    try {
      const res = await fn(...args);
      setMessage(res.message || '成功');
    } catch (e: any) {
      setMessage(e.message || '發生錯誤');
    }
  };

  // 連線 Pod 終端機
  const connectToPodTerminal = (pod: string, container: string) => {
    setPodName(pod);
    setContainerName(container);
    setMessage(`連線到 ${pod}/${container}...`);
  };

  return (
    <div className={styles.pageContainer}>
      {/* 左邊控制區 */}
      <div className={styles.controlPanel}>
        <h2>ROS2 控制面板</h2>
        {/* 省略API按鈕區塊，跟你原本一樣 */}
        <div>
          <button className={styles.button} onClick={() => handleApi(ros2Api.createDiscovery)}>建立 Discovery</button>
          <button className={styles.button} onClick={() => handleApi(ros2Api.deleteDiscovery)}>刪除 Discovery</button>
        </div>
        <div>
          <input
            placeholder="PVC 名稱"
            value={pvcname}
            onChange={e => setPvcname(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.button} onClick={() => handleApi(ros2Api.createSlamUnity, pvcname)}>建立 SLAM Unity</button>
          <button className={styles.button} onClick={() => handleApi(ros2Api.deleteSlamUnity)}>刪除 SLAM Unity</button>
        </div>
        {/* 其他按鈕同理... */}

        <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '16px 0' }} />
        <h3>終端機連線</h3>
        <div>
          <button className={styles.button} onClick={() => connectToPodTerminal('ros2-yolo', 'yolo')}>進入 YOLO Pod</button>
          <button className={styles.button} onClick={() => connectToPodTerminal('ros2-pros-car', 'car-control')}>進入 Car-Control Pod</button>
        </div>
        <div style={{ marginTop: 20, color: 'lightgreen' }}>{message}</div>
      </div>

      {/* 右邊終端機區 */}
      <div className={styles.terminalContainer}>
        {podName && containerName ? (
          <XtermTerminal
            podName={podName}
            containerName={containerName}
            backendWsBase={backendWsBase}
            token={token}
            onMessage={setMessage}
          />
        ) : (
          <div style={{ color: '#888', padding: 20 }}>請選擇一個 Pod 連線</div>
        )}
      </div>
    </div>
  );
}
