import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/user';
import { authService } from '../services/authService';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    try {
      const res = await registerUser(username, password); // 假設會回傳 { token }
      if (res.token) {
        authService.login(res.token); // 儲存 JWT
        setSuccess('Registered & logged in!');
        navigate('/'); // 跳轉到首頁或其他頁
      } else {
        setSuccess('Registered successfully! Please login.');
        navigate('/login');
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Username might be taken.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /><br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /><br />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}
