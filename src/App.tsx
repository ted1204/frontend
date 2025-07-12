// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NotebookPage from './pages/NotebookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import Ros2Page from './pages/Ros2Page';
import K8sPage from './pages/K8sPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* DashboardLayout 包住需要側邊欄的頁面 */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="notebooks" element={<NotebookPage />} />
          <Route path="ros2" element={<Ros2Page />} />
          <Route path="k8s" element={<K8sPage />} />
          {/* 你可以再新增其他頁面 */}
          {/* <Route path="profile" element={<ProfilePage />} /> */}
          {/* <Route index element={<Navigate to="notebooks" replace />} /> */}
        </Route>
        {/* 根路徑直接導到 notebooks */}
        <Route path="*" element={<Navigate to="/notebooks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
