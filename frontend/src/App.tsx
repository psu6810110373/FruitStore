import { useState, useEffect } from 'react';
import Login from './Login';

function App() {
  const [token, setToken] = useState<string | null>(null);

  // โหลด Token เก่าจาก LocalStorage (ถ้ามี) ตอนเปิดเว็บ
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🍊 Fruit Store Frontend</h1>

      {/* เช็คว่ามี Token หรือยัง? */}
      {!token ? (
        // ถ้ายังไม่มี -> โชว์หน้า Login
        <Login setToken={setToken} />
      ) : (
        // ถ้ามีแล้ว -> โชว์หน้าเนื้อหา (เดี๋ยวเรามาทำรายการผลไม้ตรงนี้)
        <div>
          <h3>ยินดีต้อนรับ! คุณเข้าสู่ระบบแล้ว ✅</h3>
          <p>Token: {token.substring(0, 20)}...</p>
          <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;