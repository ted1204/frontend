import { useEffect, useState } from 'react';
import { getAllNotebooks, createNotebook, deleteNotebook } from '../api/notebook';
import { useNavigate } from 'react-router-dom';

type Notebook = {
  id: string;
  title: string;
  content: string;
  userId: string;
};

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
    } else {
        loadData();
    }
    }, []);

    useEffect(() => {
        loadData();
    }, []);

  const loadData = async () => {
    try {
      const data = await getAllNotebooks();
      setNotebooks(data);
    } catch (error) {
      console.error('Error loading notebooks:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await createNotebook(newTitle);
      setNewTitle('');
      loadData();
    } catch (error) {
      console.error('Error creating notebook:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotebook(id);
      loadData();
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>My Notebooks</h1>

      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="enter pvc name"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {notebooks.map((nb) => (
          <li key={nb.id}>
            {nb.title} <button onClick={() => handleDelete(nb.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
