import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import FruitList from './FruitList';
import Cart, { type CartItem } from './Cart';
import MyOrders from './MyOrders';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState<'shop' | 'orders'>('shop');
  const [isAdmin, setIsAdmin] = useState(false); // ✅ สถานะ Admin

  // ฟังก์ชันแกะ Token เพื่อดูว่าใคร Login
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // 1. โหลด Token และเช็ค Admin
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      const decoded = parseJwt(savedToken);
      // เช็คว่าเป็น admin หรือไม่ (ดูทั้ง username และ role เผื่อไว้)
      if (decoded && (decoded.username === 'admin' || decoded.role === 'admin')) {
        setIsAdmin(true);
      }
    }
  }, [token]);

  // 2. Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCart([]);
    setIsAdmin(false);
    setPage('shop');
    window.location.reload();
  };

  // 3. จัดการตะกร้าสินค้า
  const handleAddToCart = (fruit: any) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === fruit.id);
      if (found) return prev.map((i) => (i.id === fruit.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...fruit, quantity: 1 }];
    });
  };

  const handleIncrease = (id: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const handleDecrease = (id: number) => {
    setCart((prev) => 
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  // 4. สั่งซื้อ (Checkout)
  const handleCheckout = async () => {
    if (cart.length === 0) return alert("ตะกร้าว่างเปล่า!");
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    if (!confirm(`ยืนยันการสั่งซื้อ ฿${total}?`)) return;

    try {
      await axios.post('http://localhost:3000/orders', {
        items: cart.map(i => ({ fruitId: i.id, quantity: i.quantity }))
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("🎉 สั่งซื้อสำเร็จ!");
      setCart([]);
      setPage('orders');
    } catch (err: any) {
      alert(`❌ ผิดพลาด: ${err.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h1 style={{ margin: 0, color: '#ff6b6b', cursor: 'pointer' }} onClick={() => setPage('shop')}>
          🍊 Fruit Store {isAdmin && <span style={{fontSize: '0.5em', background: 'gold', padding: '2px 5px', borderRadius: 4, color: '#333'}}>👑 Admin</span>}
        </h1>
        {token && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setPage('orders')} style={{ background: 'none', border: '1px solid #ccc', borderRadius: 5, padding: '8px 15px', cursor: 'pointer' }}>📜 ประวัติ</button>
            {page === 'shop' && <span>🛒 <b>{cart.reduce((s, i) => s + i.quantity, 0)}</b> ชิ้น</span>}
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
          </div>
        )}
      </div>

      {!token ? (
        <Login setToken={setToken} />
      ) : page === 'orders' ? (
        <MyOrders token={token} onBack={() => setPage('shop')} />
      ) : (
        <div style={{ display: 'flex', gap: '40px', flexDirection: 'row-reverse' }}>
          <div style={{ flex: 1, minWidth: '350px' }}>
            <Cart cart={cart} onRemove={handleRemoveFromCart} onCheckout={handleCheckout} onIncrease={handleIncrease} onDecrease={handleDecrease} />
          </div>
          <div style={{ flex: 2 }}>
            {/* ✅ ส่ง isAdmin ไปให้ FruitList เพื่อจัดการสิทธิ์ เพิ่ม/ลบ */}
            <FruitList token={token} onAddToCart={handleAddToCart} isAdmin={isAdmin} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;