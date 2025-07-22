import React, { useState } from 'react';
import { useInformerSocket } from '../hooks/useInformerSocket';
import { ros2Api } from '../api/ros2';
import Ros2ActionButton from './Ros2ActionButton';
import { useAuthInfo } from '../hooks/useAuthInfo';

const ros2ResourceMap = [
  {
    name: 'ros2-pros-car',
    type: 'pod',
    label: 'Car control',
    create: ros2Api.createCarControl,
    delete: ros2Api.deleteCarControl,
    needsPvc: true,
  },
  {
    name: 'ros2-slam-unity',
    type: 'pod',
    label: 'SLAM unity',
    create: ros2Api.createSlamUnity,
    delete: ros2Api.deleteSlamUnity,
    needsPvc: true,
  },
  {
    name: 'ros2-localization-unity',
    type: 'pod',
    label: 'Localization unity',
    create: ros2Api.createLocalization,
    delete: ros2Api.deleteLocalization,
    needsPvc: true,
  },
  {
    name: 'ros2-yolo',
    type: 'pod',
    label: 'YOLO detection',
    create: ros2Api.createYolo,
    delete: ros2Api.deleteYolo,
    needsPvc: true,
  },
  {
    name: 'ros2-discovery-server',
    type: 'pod',
    label: 'Discovery Server',
    create: ros2Api.createDiscovery,
    delete: ros2Api.deleteDiscovery,
  },
  {
    name: 'ros2-bridge-service',
    type: 'service',
    label: 'Ros Bridge Service',
  },
];

export default function Ros2StatusList() {
  const token = localStorage.getItem('token') || '';
  const { pvcname } = useAuthInfo();
  const { pods, services } = useInformerSocket(token);
  const [message, setMessage] = useState('');

  const isRunning = (name: string, type: string) => {
    if (type === 'pod') {
      return pods.find((p) => p.name === name && p.phase === 'Running');
    }
    if (type === 'service') {
      return services.find((s) => s.name === name);
    }
    return false;
  };

  const getExternalIp = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName);
    return service?.externalIP || '無';
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">ROS2 模組控制面板</h2>
      {message && <div className="text-sm text-blue-600">{message}</div>}

          {ros2ResourceMap.map((resource) => {
      const running = isRunning(resource.name, resource.type);

      return (
        <div
          key={resource.name}
          className="border p-3 rounded-md shadow-sm flex items-center justify-between"
        >
          <div>
            <div className="font-semibold">{resource.label}</div>
            <div className="text-sm text-gray-600">
              {resource.type === 'pod' ? (
                running ? '狀態：🟢 執行中' : '狀態：⚪ 已關閉'
              ) : (
                <>
                  {running ? '🟢 Service 啟用中' : '⚪ Service 尚未啟用'}
                  {/* 針對 bridge service 顯示 External IP */}
                  {resource.name === 'ros2-bridge-service' && running && (
                    <div>External IP: {getExternalIp(resource.name)}</div>
                  )}
                </>
              )}
            </div>
          </div>

            {resource.type === 'pod' && (
              <div className="flex gap-2 items-center">
                {running ? (
                  <Ros2ActionButton
                    label="❌ 停止"
                    action={resource.delete ?? (async () => {})}
                    setMessage={setMessage}
                  />
                ) : (
                  <Ros2ActionButton
                    label="▶ 啟動"
                    action={resource.create ?? (async () => {})}
                    args={resource.needsPvc ? [pvcname] : []} // ✅ 自動帶入 pvcname
                    setMessage={setMessage}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
