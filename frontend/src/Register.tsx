import { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  onSwitchToLogin: () => void; // ฟังก์ชันสลับกลับไปหน้า Login
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("กรุณากรอกข้อมูลให้ครบ");

    setLoading(true);
    try {
      // ยิง API สมัครสมาชิก
      await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
      });

      alert("🎉 สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
      onSwitchToLogin(); // เด้งกลับไปหน้า Login อัตโนมัติ

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "สมัครไม่สำเร็จ (ชื่อซ้ำหรือรหัสสั้นไป)";
      alert(`❌ Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 30, border: '1px solid #ddd', borderRadius: 10, textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#28a745' }}>📝 สมัครสมาชิกใหม่</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 12, borderRadius: 5, border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password (อย่างน้อย 8 ตัว)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 12, borderRadius: 5, border: '1px solid #ccc' }}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: 12, background: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: '1em' }}
        >
          {loading ? 'กำลังบันทึก... ⏳' : 'ยืนยันการสมัคร ✅'}
        </button>
      </form>

      <div style={{ marginTop: 20, fontSize: '0.9em' }}>
        มีบัญชีอยู่แล้ว?{' '}
        <span 
          onClick={onSwitchToLogin}
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          กลับไปล็อกอิน
        </span>
      </div>
    </div>
  );
}