// src/hooks/useInformerSocket.ts
import { useEffect, useRef, useState } from 'react';
import { createInformerSocket } from '../api/websocket';
import type { ResourceEvent } from '../api/websocket';

// 你指定會追蹤的 Pod/Service 名稱
const TARGET_PODS = [
  'ros2-pros-car',
  'ros2-slam-unity',
  'ros2-yolo',
  'ros2-localization-unity',
  'ros2-discovery-server',
];

const TARGET_SERVICES = [
  'ros2-bridge-service',
  'ros2-discovery-server',
];

export interface PodInfo {
  name: string;
  phase: string | null;
}

export interface ServiceInfo {
  name: string;
  type: string | null;
  clusterIP: string | null;
  externalIP: string | null;
  ports: { port: number; protocol: string; nodePort: number | null }[];
}

export function useInformerSocket(token: string) {
  const [pods, setPods] = useState<Record<string, PodInfo>>({});
  const [services, setServices] = useState<Record<string, ServiceInfo>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    wsRef.current = createInformerSocket(token, (event: ResourceEvent) => {
      if ('error' in event) {
        console.error('[WebSocket Error]', event.error);
        return;
      }

      const { type, resource, obj } = event;

      if (resource === 'pod' && TARGET_PODS.includes(obj.name)) {
        setPods((prev) => {
          const updated = { ...prev };
          if (type === 'DELETED') {
            delete updated[obj.name];
          } else {
            updated[obj.name] = {
              name: obj.name,
              phase: obj.phase || 'Unknown',
            };
          }
          return updated;
        });
      }

      if (resource === 'service' && TARGET_SERVICES.includes(obj.name)) {
        setServices((prev) => {
          const updated = { ...prev };
          if (type === 'DELETED') {
            delete updated[obj.name];
          } else {
            updated[obj.name] = {
              name: obj.name,
              type: obj.type || null,
              clusterIP: obj.clusterIP || null,
              externalIP: obj.externalIP || null,
              ports: obj.ports || [],
            };
          }
          return updated;
        });
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, [token]);

  return {
    pods: Object.values(pods),
    services: Object.values(services),
  };
}
