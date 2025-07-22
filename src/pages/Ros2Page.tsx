import React, { useState } from 'react';
import { ros2Api } from '../api/ros2';
import XtermTerminal from '../components/XtermTerminal';
import styles from '../styles/Ros2Page.module.css';
import { WS_BASE_URL } from '../config/config';
import { useAuthInfo } from '../hooks/useAuthInfo';
import Ros2ActionButton from '../components/Ros2ActionButton';

export default function Ros2Page() {
  const { token, pvcname } = useAuthInfo();
  const [message, setMessage] = useState('');
  const [podName, setPodName] = useState<string | null>(null);
  const [containerName, setContainerName] = useState<string | null>(null);
  const backendWsBase = WS_BASE_URL;

  const connectToPodTerminal = (pod: string, container: string) => {
    setPodName(pod);
    setContainerName(container);
    setMessage(`連線到 ${pod}/${container}...`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.controlPanel}>
        {/* <h2>ROS2 控制面板</h2>
        <div>
          <Ros2ActionButton label="建立 Discovery" action={ros2Api.createDiscovery} setMessage={setMessage} />
          <Ros2ActionButton label="刪除 Discovery" action={ros2Api.deleteDiscovery} setMessage={setMessage} />
        </div>
        <div>
          <Ros2ActionButton label="建立 SLAM Unity" action={ros2Api.createSlamUnity} args={[pvcname]} setMessage={setMessage} />
          <Ros2ActionButton label="刪除 SLAM Unity" action={ros2Api.deleteSlamUnity} setMessage={setMessage} />
        </div>
        <div>
          <Ros2ActionButton label="建立 Localization Unity" action={ros2Api.createLocalization} args={[pvcname]} setMessage={setMessage} />
          <Ros2ActionButton label="刪除 Localization Unity" action={ros2Api.deleteLocalization} setMessage={setMessage} />
        </div>
        <div>
          <Ros2ActionButton label="建立 YOLO" action={ros2Api.createYolo} args={[pvcname]} setMessage={setMessage} />
          <Ros2ActionButton label="刪除 YOLO" action={ros2Api.deleteYolo} setMessage={setMessage} />
        </div>
        <div>
          <Ros2ActionButton label="建立 Car-Control" action={ros2Api.createCarControl} args={[pvcname]} setMessage={setMessage} />
          <Ros2ActionButton label="刪除 Car-Control" action={ros2Api.deleteCarControl} setMessage={setMessage} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '16px 0' }} /> */}
        <h3>終端機連線</h3>
        <div>
          <button className={styles.button} onClick={() => connectToPodTerminal('ros2-yolo', 'pros-cameraapi')}>
            進入 YOLO Pod
          </button>
          <button className={styles.button} onClick={() => connectToPodTerminal('ros2-pros-car', 'pros-car')}>
            進入 Car-Control Pod
          </button>
        </div>
        <div style={{ marginTop: 20, color: 'lightgreen' }}>{message}</div>
      </div>

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
