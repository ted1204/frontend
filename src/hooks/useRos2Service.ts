// src/hooks/useRos2Service.ts
import { useState } from 'react';
import { ros2Api } from '../api/ros2';

export function useRos2Service(pvcname: string) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handle = async (fn: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setLoading(true);
    setMessage('處理中...');
    try {
      const res = await fn(...args);
      setMessage(res.message || '成功');
    } catch (e: any) {
      setMessage(e.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    loading,
    startDiscovery: () => handle(ros2Api.createDiscovery),
    stopDiscovery: () => handle(ros2Api.deleteDiscovery),
    startSLAM: () => handle(ros2Api.createSlamUnity, pvcname),
    stopSLAM: () => handle(ros2Api.deleteSlamUnity),
    startYolo: () => handle(ros2Api.createYolo, pvcname),
    stopYolo: () => handle(ros2Api.deleteYolo),
    startCarControl: () => handle(ros2Api.createCarControl, pvcname),
    stopCarControl: () => handle(ros2Api.deleteCarControl),
    startLocalization: () => handle(ros2Api.createLocalization, pvcname),
    stopLocalization: () => handle(ros2Api.deleteLocalization),
    storeMap: () => handle(ros2Api.storeMap),
    setMessage, // 提供外部修改訊息（給終端機連線用）
  };
}
