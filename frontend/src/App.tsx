import { useState, useEffect } from 'react';
import Login from './Login';
import FruitList from './FruitList';

function App() {
  const [token, setToken] = useState<string | null>(null);

  // โหลด Token จาก LocalStorage เมื่อเปิดเว็บ
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.reload(); // รีโหลดหน้าเว็บเพื่อให้เคลียร์ค่าทุกอย่างสะอาดจริงๆ
  };

  // ฟังก์ชันจำลองการใส่ตะกร้า (เดี๋ยวมาทำจริงต่อ)
  const handleAddToCart = (fruit: any) => {
    alert(`🛒 เพิ่ม "${fruit.name}" ลงตะกร้าแล้ว!`);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      {/* ส่วนหัว Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h1 style={{ margin: 0, color: '#ff6b6b' }}>🍊 Fruit Store</h1>
        {token && (
          <button 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: '#dc3545', color: 'white', border: 'none', 
              padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' 
            }}
          >
            Logout 🚪
          </button>
        )}
      </div>

      {/* เงื่อนไขการแสดงผล */}
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div>
          {/* ส่ง Token ไปให้ FruitList ใช้ยิง API */}
          <FruitList token={token} onAddToCart={handleAddToCart} />
        </div>
      )}

    </div>
  );
}

export default App;