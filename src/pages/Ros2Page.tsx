import React, { useEffect, useRef, useState } from 'react';
import { ros2Api } from '../api/ros2';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach'; // 引入 AttachAddon
import { FitAddon } from 'xterm-addon-fit'; // 新增這行
import 'xterm/css/xterm.css';

export default function Ros2Page() {
  const [message, setMessage] = useState('');
  const [pvcname, setPvcname] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const xterm = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null); // 用於儲存 WebSocket 連線
  const fitAddon = useRef<FitAddon | null>(null); // 新增這行


  // 初始化 Xterm 終端機
  useEffect(() => {
    if (!terminalRef.current) return;

    xterm.current = new Terminal({
      cols: 100, // 調整寬度
      rows: 30,  // 調整高度
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#f8f8f0',
      },
      fontFamily: 'monospace',
      fontSize: 14,
    });
    fitAddon.current = new FitAddon(); // 新增這行
    xterm.current.loadAddon(fitAddon.current); // 新增這行
    xterm.current.open(terminalRef.current);
    fitAddon.current.fit(); // 新增這行，讓終端機自動適應容器
    xterm.current.writeln('Welcome to ROS2 Terminal. Please select a pod to connect.');

    // 不需要監聽 onData，因為我們會用 WebSocket 的 AttachAddon 處理
    // xterm.current.onData(data => { ... });

    return () => {
      // 在元件卸載時關閉 WebSocket 連線並清除 xterm
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      xterm.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      fitAddon.current?.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 通用 API 呼叫函式
  const handleApi = async (fn: (...args: any[]) => Promise<any>, ...args: any[]) => {
    setMessage('處理中...');
    try {
      const res = await fn(...args);
      setMessage(res.message || '成功');
      xterm.current?.writeln(`> API Call Success: ${res.message || '成功'}`);
    } catch (e: any) {
      setMessage(e.message || '發生錯誤');
      xterm.current?.writeln(`> API Call Error: ${e.message || '發生錯誤'}`);
    }
  };

  // 處理進入 Pod 的終端機連線
  const connectToPodTerminal = async (podName: string, containerName: string) => {
    // 關閉現有的 WebSocket 連線
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    xterm.current?.clear();
    xterm.current?.writeln(`Connecting to ${podName}/${containerName}...\r\n`);
    setMessage(`連線到 ${podName}/${containerName}...`);

    try {
      // 後端 API 來獲取 WebSocket 連線 URL
      // 假設後端有一個 API 可以返回 WebSocket URL
      // 例如：const wsUrl = await ros2Api.getPodTerminalWsUrl(podName, containerName);
      // 因為這類 API 通常會包含用戶 token 等敏感資訊，所以通常不會直接傳到前端
      // 最好的方式是前端發起一個 HTTP 請求，後端收到請求後建立 WS 連線並將其 URL 返回，
      // 或者直接在後端處理 WebSocket 握手
      // 這裡我們直接構造一個預期的 WS URL
      const backendWsBase = 'ws://localhost:3000'; // 替換為你後端的 WebSocket 服務地址
      const wsUrl = `${backendWsBase}/ws/exec?pod=${podName}&container=${containerName}`; // 這是前端假設的 WS URL

      const socket = new WebSocket(wsUrl);
      socketRef.current = socket; // 儲存 WebSocket 實例

      // 使用 xterm-addon-attach 插件來處理 WebSocket 的輸入輸出
      const attachAddon = new AttachAddon(socket);
      xterm.current?.loadAddon(attachAddon);

      // WebSocket 事件監聽
      socket.onopen = () => {
        setMessage(`已連線到 ${podName}/${containerName}。`);
        xterm.current?.writeln(`\x1b[32mConnected to ${podName}/${containerName}\x1b[0m\r\n`); // 綠色文字
        // 確保終端機尺寸與 WebSocket 連線同步
        fitAddon.current?.fit(); // 修正這裡
        socket.send(JSON.stringify({
            type: 'resize',
            cols: xterm.current?.cols,
            rows: xterm.current?.rows
        }));
      };

      socket.onclose = () => {
        setMessage(`已斷開與 ${podName}/${containerName} 的連線。`);
        xterm.current?.writeln('\r\n\x1b[31mDisconnected.\x1b[0m\r\n'); // 紅色文字
        if (socketRef.current === socket) { // 如果是當前連線斷開
          socketRef.current = null;
        }
      };

      socket.onerror = (error) => {
        setMessage(`連線錯誤: ${error.type}`);
        xterm.current?.writeln(`\r\n\x1b[31mConnection Error: ${error.type}\x1b[0m\r\n`);
        if (socketRef.current === socket) { // 如果是當前連線錯誤
          socketRef.current = null;
        }
      };

      // xterm 尺寸改變時，通知後端
      xterm.current?.onResize((size) => {
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                  type: 'resize',
                  cols: size.cols,
                  rows: size.rows
              }));
          }
      });

    } catch (error: any) {
      setMessage(`連線失敗: ${error.message}`);
      xterm.current?.writeln(`\r\n\x1b[31mFailed to connect: ${error.message}\x1b[0m\r\n`);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 4rem)', gap: '1rem' }}> {/* 調整高度以適應頁面佈局，減去 padding */}
      {/* 左邊控制區 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        background: '#292929',
        color: '#fff',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px' // 增加間距
      }}>
        <h2>ROS2 控制面板</h2>
        {/* API 呼叫區塊 */}
        <div>
          <button onClick={() => handleApi(ros2Api.createDiscovery)}>建立 Discovery</button>
          <button onClick={() => handleApi(ros2Api.deleteDiscovery)}>刪除 Discovery</button>
        </div>
        <div>
          <input
            placeholder="PVC 名稱"
            value={pvcname}
            onChange={e => setPvcname(e.target.value)}
            style={{ marginRight: 8, background: '#333', border: '1px solid #555', color: '#fff' }}
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

        {/* 新增的進入 Pod 按鈕 */}
        <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '16px 0' }} />
        <h3>終端機連線</h3>
        <div>
          <button onClick={() => connectToPodTerminal('ros2-yolo', 'yolo')}>進入 YOLO Pod</button>
          <button onClick={() => connectToPodTerminal('ros2-pros-car', 'car-control')}>進入 Car-Control Pod</button>
          {/* 假設 'ros2-yolo' 和 'ros2-pros-car' 是你的 Deployment 或 Pod 名稱 */}
          {/* 'yolo' 和 'car-control' 是對應容器的名稱 */}
        </div>
        <div style={{ marginTop: 20, color: 'lightgreen' }}>{message}</div>
      </div>

      {/* 右邊終端機區 */}
      <div
        ref={terminalRef}
        style={{
          flex: 2, // 終端機佔比更大，讓它看起來更像橫向長方形
          backgroundColor: '#1e1e1e',
          borderRadius: 8,
          overflow: 'hidden',
          fontSize: '14px',
          lineHeight: '1.2',
        }}
      />
    </div>
  );
}
