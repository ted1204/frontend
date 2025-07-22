import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/user';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      navigate('/ros2');
    } catch (err) {
      console.error(err);
      setError('Login failed. Check username or password.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}
