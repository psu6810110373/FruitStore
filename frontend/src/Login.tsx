import { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  setToken: (token: string) => void;
  onSwitchToRegister: () => void;
}

export default function Login({ setToken, onSwitchToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. ส่งข้อมูลไป Login
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });

      const token = response.data.access_token;
      
      // ✅ 2. บันทึกข้อมูลสำคัญ (Username + Token)
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);
      
      // 3. ส่ง Token ให้ App
      setToken(token);

      // 🔄 4. รีเฟรชหน้าเว็บทันที 1 ครั้ง (เพื่อให้ App.tsx อัปเดตสถานะ Admin)
      window.location.reload();
      
    } catch (err) {
      console.error(err);
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง ❌');
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '50px auto', textAlign: 'center', padding: 30, border: '1px solid #ddd', borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <h2 style={{ color: '#ff6b6b', marginTop: 0 }}>🍎 Fruit Store Login</h2>
      <p style={{ color: '#666', fontSize: '0.9em' }}>กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า</p>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 12, borderRadius: 5, border: '1px solid #ccc', fontSize: '1em' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, borderRadius: 5, border: '1px solid #ccc', fontSize: '1em' }}
        />
        <button type="submit" style={{ padding: 12, cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: 5, fontWeight: 'bold', fontSize: '1em' }}>
          เข้าสู่ระบบ 🔐
        </button>
      </form>
      
      {error && <div style={{ color: '#dc3545', marginTop: 15, background: '#ffe6e6', padding: 10, borderRadius: 5 }}>{error}</div>}
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee', fontSize: '0.9em' }}>
        ยังไม่มีบัญชีสมาชิก?{' '}
        <span 
          onClick={onSwitchToRegister}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          สมัครสมาชิกใหม่ที่นี่
        </span>
      </div>
    </div>
  );
}