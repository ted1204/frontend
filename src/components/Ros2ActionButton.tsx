// src/components/Ros2ActionButton.tsx
import React from 'react';
import styles from '../styles/Ros2Page.module.css';

interface Ros2ActionButtonProps {
  label: string;
  action: (...args: any[]) => Promise<any>;
  args?: any[];
  setMessage: (msg: string) => void;
}

const Ros2ActionButton: React.FC<Ros2ActionButtonProps> = ({ label, action, args = [], setMessage }) => {
  const handleClick = async () => {
    setMessage('處理中...');
    try {
      const res = await action(...args);
      setMessage(res.message || '成功');
    } catch (e: any) {
      setMessage(e.message || '發生錯誤');
    }
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Ros2ActionButton;
