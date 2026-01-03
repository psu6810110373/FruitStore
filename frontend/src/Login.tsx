import { useState } from 'react';
import axios from 'axios';

// สร้าง Interface รับ Props เพื่อบังคับส่ง Token กลับไปให้ App ตัวแม่ 
interface LoginProps {
  setToken: (token: string) => void;
}

export default function Login({ setToken }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh เอง
    try {
      // ยิง API ไปที่ Backend
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });

      // ถ้าสำเร็จ: ดึง Token ออกมาแล้วส่งไปเก็บไว้
      console.log("Response จาก Backend:", response.data);
      const token = response.data.access_token;
      
      localStorage.setItem('token', token);
      setToken(token);
      alert('Login สำเร็จ! 🎉');
      
    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ❌');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto', textAlign: 'center' }}>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 8 }}
        />
        <button type="submit" style={{ padding: 10, cursor: 'pointer' }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}