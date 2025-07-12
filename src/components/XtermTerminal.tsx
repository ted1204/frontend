// components/XtermTerminal.tsx
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface XtermTerminalProps {
  podName: string;
  containerName: string;
  backendWsBase: string; // 例如 ws://localhost:3000
  token: string;         // JWT Token
  onMessage?: (msg: string) => void; // 可選回調，回傳狀態訊息
}

const XtermTerminal: React.FC<XtermTerminalProps> = ({
  podName,
  containerName,
  backendWsBase,
  token,
  onMessage,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xterm = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // 初始化 xterm
    xterm.current = new Terminal({
      cursorBlink: true,
      scrollback: 1000,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
        cursor: '#f8f8f0',
      },
      fontFamily: 'monospace',
      fontSize: 14,
      convertEol: true, 
      disableStdin: false, 
    });

    fitAddon.current = new FitAddon();
    xterm.current.loadAddon(fitAddon.current);
    xterm.current.open(terminalRef.current);
 
    fitAddon.current.fit();

    xterm.current.writeln('Connecting to pod...');

    // 建立 WebSocket 連線
    const wsUrl = `${backendWsBase}/ws/terminal?token=${token}&pod=${podName}&container=${containerName}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // 使用 AttachAddon 綁定 WebSocket 與 xterm
    const attachAddon = new AttachAddon(socket);
    xterm.current.loadAddon(attachAddon);

    socket.onopen = () => {
      onMessage?.(`已連線到 ${podName}/${containerName}`);
      xterm.current?.writeln(`\x1b[32mConnected to ${podName}/${containerName}\x1b[0m\r\n`);
      fitAddon.current?.fit();
      // 傳送終端機尺寸給後端
      socket.send(JSON.stringify({
        type: 'resize',
        cols: xterm.current?.cols,
        rows: xterm.current?.rows,
      }));
    };

    xterm.current.onData((data) => {
      console.log('Key pressed:', data);
    });

    socket.onclose = () => {
      onMessage?.(`已斷開與 ${podName}/${containerName} 的連線`);
      xterm.current?.writeln('\r\n\x1b[31mDisconnected.\x1b[0m\r\n');
      socketRef.current = null;
    };

    socket.onerror = (err) => {
      onMessage?.(`連線錯誤`);
      xterm.current?.writeln(`\r\n\x1b[31mConnection Error\x1b[0m\r\n`);
      console.error('WebSocket error:', err);
    };

    xterm.current.onResize((size) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'resize',
          cols: size.cols,
          rows: size.rows,
        }));
      }
    });

    return () => {
      socket.close();
      xterm.current?.dispose();
    };
  }, [podName, containerName, backendWsBase, token, onMessage]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        overflow: 'hidden',
        fontSize: '14px',
        lineHeight: '1.2',
      }}
    />
  );
};

export default XtermTerminal;
