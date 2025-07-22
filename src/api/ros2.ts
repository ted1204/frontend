import { BASE_URL } from '../config/config';

async function callRos2Api(method: 'POST' | 'DELETE', path: string, body?: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // 如果有 cookie 認證
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

export const ros2Api = {
  createDiscovery: () => callRos2Api('POST', '/ros2/discovery'),
  deleteDiscovery: () => callRos2Api('DELETE', '/ros2/discovery'),
  createSlamUnity: (pvcname: string) => callRos2Api('POST', '/ros2/slamunity', { pvcname }),
  deleteSlamUnity: () => callRos2Api('DELETE', '/ros2/slamunity'),
  createLocalization: (pvcname: string) => callRos2Api('POST', '/ros2/localization', { pvcname }),
  deleteLocalization: () => callRos2Api('DELETE', '/ros2/localization'),
  storeMap: () => callRos2Api('POST', '/ros2/store'),
  createCarControl: (pvcname: string) => callRos2Api('POST', '/ros2/car', { pvcname }),
  deleteCarControl: () => callRos2Api('DELETE', '/ros2/car'),
  createYolo: (pvcname: string) => callRos2Api('POST', '/ros2/yolo', { pvcname }),
  deleteYolo: () => callRos2Api('DELETE', '/ros2/yolo'),
};
