// src/pages/K8sPage.tsx
import { useState } from 'react';
import { createPVC } from '../api/k8s';

function K8sPage() {
  const [pvcName, setPvcName] = useState('');
  const [result, setResult] = useState('');

  const handleCreatePVC = async () => {
    try {
      const data = await createPVC(pvcName);
      setResult(`✅ PVC 建立成功: ${JSON.stringify(data)}`);
    } catch (err: any) {
      setResult(`❌ 建立失敗: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">K8s 工具頁</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="輸入 PVC 名稱"
          value={pvcName}
          onChange={(e) => setPvcName(e.target.value)}
          className="border border-gray-400 px-3 py-2 mr-2 rounded"
        />
        <button
          onClick={handleCreatePVC}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          建立 PVC
        </button>
      </div>
      {result && <div className="mt-2 text-sm text-gray-700">{result}</div>}
    </div>
  );
}

export default K8sPage;
