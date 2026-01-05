import { useState, useEffect } from 'react';
import Login from './Login';
import FruitList from './FruitList';
import Cart, {type CartItem } from './Cart';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // โหลด Token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCart([]);
    window.location.reload();
  };

  // ✅ 1. เพิ่มสินค้า (ใช้สำหรับหน้า FruitList)
  const handleAddToCart = (fruit: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === fruit.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === fruit.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...fruit, quantity: 1 }];
      }
    });
  };

  // ✅ 2. เพิ่มจำนวน (ปุ่ม + ในตะกร้า)
  const handleIncrease = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // ✅ 3. ลดจำนวน (ปุ่ม - ในตะกร้า)
  const handleDecrease = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) // ถ้าเหลือ 0 ให้ลบทิ้งไปเลย
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (confirm(`ยืนยันการสั่งซื้อยอดรวม ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} บาท?`)) {
      alert("เตรียมเชื่อมต่อ API สั่งซื้อครับ! 🚀");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h1 style={{ margin: 0, color: '#ff6b6b' }}>🍊 Fruit Store</h1>
        {token && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>ตะกร้า: <b>{cart.reduce((s, i) => s + i.quantity, 0)}</b> ชิ้น</span>
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Logout 🚪
            </button>
          </div>
        )}
      </div>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div style={{ display: 'flex', gap: '40px', flexDirection: 'row-reverse' }}>
          
          {/* ส่งฟังก์ชันเพิ่ม/ลด ไปให้ Cart */}
          <div style={{ flex: 1, minWidth: '350px' }}>
            <Cart 
              cart={cart} 
              onRemove={handleRemoveFromCart} 
              onCheckout={handleCheckout} 
              onIncrease={handleIncrease} // 👈 ส่งเพิ่ม
              onDecrease={handleDecrease} // 👈 ส่งเพิ่ม
            />
          </div>

          <div style={{ flex: 2 }}>
            <FruitList token={token} onAddToCart={handleAddToCart} />
          </div>

        </div>
      )}

    </div>
  );
}

export default App;