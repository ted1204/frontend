// src/api/websocket.ts
import { WS_BASE_URL } from '../config/config';
export type ResourceEvent =
  | { type: 'ADDED' | 'MODIFIED' | 'DELETED'; resource: string; obj: any }
  | { error: string };

export function createInformerSocket(token: string, onMessage: (event: ResourceEvent) => void): WebSocket {
  const ws = new WebSocket(`${WS_BASE_URL}/ws/informer?token=${token}`);

  ws.onopen = () => {
    console.log('[WebSocket] Connected to informer');
  };

  ws.onmessage = (event) => {
    try {
      const data: ResourceEvent = JSON.parse(event.data);
      onMessage(data);
      console.log("[data]:", data);
    } catch (err) {
      console.error('[WebSocket] Message parse error', err);
    }
  };

  ws.onerror = (err) => {
    console.error('[WebSocket] Error', err);
  };

  ws.onclose = (event) => {
    console.log('[WebSocket] Closed', event);
  };

  return ws;
}
