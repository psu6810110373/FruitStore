import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import FruitList from './FruitList';
import Cart, {type CartItem } from './Cart';

function App() {
  // --- State หลัก ---
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>(''); // เก็บชื่อคนล็อกอิน
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- State สำหรับ Admin เพิ่มสินค้า ---
  const [newFruit, setNewFruit] = useState({ name: '', price: 0, description: '', stock: 0 });
  const [isFormVisible, setIsFormVisible] = useState(false); // เปิด/ปิดฟอร์ม

  // 1. โหลดข้อมูลเมื่อเปิดเว็บ (Token & Username)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('username');
    
    if (savedToken) setToken(savedToken);
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // 2. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.clear(); // ล้างทุกอย่าง
    setToken(null);
    setCurrentUser('');
    setCart([]);
    window.location.reload();
  };

  // ✅ 3. เช็คว่าเป็น Admin หรือไม่? (ใช้ .toLowerCase เผื่อพิมพ์ตัวใหญ่เล็ก)
  const isAdmin = currentUser?.toLowerCase() === 'admin'; 

  // --- ฟังก์ชันเพิ่มสินค้า (Admin Only) ---
  const handleAddFruit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/fruits', newFruit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`เพิ่ม "${newFruit.name}" สำเร็จ! ✅`);
      setNewFruit({ name: '', price: 0, description: '', stock: 0 });
      setIsFormVisible(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาด! (คุณอาจไม่มีสิทธิ์)');
    }
  };

  // --- Logic ตะกร้าสินค้า ---
  const handleAddToCart = (fruit: any) => {
    setCart((prev) => {
      const exist = prev.find(i => i.id === fruit.id);
      return exist 
        ? prev.map(i => i.id === fruit.id ? {...i, quantity: i.quantity + 1} : i) 
        : [...prev, {...fruit, quantity: 1}];
    });
  };

  const handleIncrease = (id: number) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, quantity: i.quantity + 1} : i));
  };

  const handleDecrease = (id: number) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, quantity: i.quantity - 1} : i).filter(i => i.quantity > 0));
  };

  const handleRemove = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };
  
  const handleCheckout = async () => {
    if (cart.length === 0) return alert('ตะกร้าว่างเปล่า!');
    if (!confirm('ยืนยันการสั่งซื้อ?')) return;
    try {
      await axios.post('http://localhost:3000/orders', 
        { items: cart.map(i => ({ fruitId: i.id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('สั่งซื้อสำเร็จ! 🎉');
      setCart([]);
      window.location.reload();
    } catch (e) { alert('สั่งซื้อไม่สำเร็จ'); }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottom: '1px solid #eee' }}>
        <div>
          <h1 style={{ color: '#ff6b6b', margin: '0 0 5px 0' }}>🍊 Fruit Store</h1>
          {currentUser && (
            <span style={{ fontSize: '0.9em', color: '#666' }}>
              ผู้ใช้: <strong style={{ color: isAdmin ? '#007bff' : '#333' }}>{currentUser}</strong> {isAdmin ? '(👑 Admin)' : '(ลูกค้า)'}
            </span>
          )}
        </div>
        
        {token && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* ปุ่ม Admin: แสดงเฉพาะ admin */}
            {isAdmin && (
              <button 
                onClick={() => setIsFormVisible(!isFormVisible)}
                style={{ background: isFormVisible ? '#6c757d' : '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isFormVisible ? 'ปิดฟอร์ม ❌' : '+ เพิ่มสินค้าใหม่'}
              </button>
            )}
            <button onClick={handleLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Logout 🚪
            </button>
          </div>
        )}
      </div>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div>
          {/* ฟอร์ม Admin */}
          {isAdmin && isFormVisible && (
            <div style={{ background: '#f8f9fa', padding: 25, borderRadius: 10, marginBottom: 30, border: '1px solid #dee2e6' }}>
              <h3 style={{ marginTop: 0, color: '#007bff' }}>🍌 เพิ่มสินค้าใหม่ (Admin Only)</h3>
              <form onSubmit={handleAddFruit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                <input placeholder="ชื่อสินค้า" value={newFruit.name} onChange={e => setNewFruit({...newFruit, name: e.target.value})} required style={{padding: 10, border: '1px solid #ccc', borderRadius: 4}} />
                <input type="number" placeholder="ราคา" value={newFruit.price || ''} onChange={e => setNewFruit({...newFruit, price: +e.target.value})} required style={{padding: 10, border: '1px solid #ccc', borderRadius: 4}} />
                <input placeholder="รายละเอียด" value={newFruit.description} onChange={e => setNewFruit({...newFruit, description: e.target.value})} style={{padding: 10, gridColumn: 'span 2', border: '1px solid #ccc', borderRadius: 4}} />
                <input type="number" placeholder="จำนวนสต็อก" value={newFruit.stock || ''} onChange={e => setNewFruit({...newFruit, stock: +e.target.value})} required style={{padding: 10, border: '1px solid #ccc', borderRadius: 4}} />
                <button type="submit" style={{ gridColumn: 'span 2', background: '#28a745', color: 'white', border: 'none', padding: 12, borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}>บันทึก ✅</button>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', gap: '30px', flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '350px' }}>
              <Cart cart={cart} onRemove={handleRemove} onCheckout={handleCheckout} onIncrease={handleIncrease} onDecrease={handleDecrease} />
            </div>
            <div style={{ flex: 2, minWidth: '350px' }}>
              <FruitList token={token} onAddToCart={handleAddToCart} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;