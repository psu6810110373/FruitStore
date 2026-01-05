import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import FruitList from './FruitList';
import Cart, {type CartItem } from './Cart';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. โหลด Token เก่าตอนเปิดเว็บ
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  // 2. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCart([]);
    window.location.reload(); // รีโหลดล้างค่าทุกอย่าง
  };

  // 3. ฟังก์ชันเพิ่มสินค้าลงตะกร้า (จากหน้า FruitList)
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

  // 4. ฟังก์ชันเพิ่มจำนวน (ปุ่ม +)
  const handleIncrease = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 5. ฟังก์ชันลดจำนวน (ปุ่ม -)
  const handleDecrease = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0) // ถ้า 0 ลบทิ้ง
    );
  };

  // 6. ฟังก์ชันลบสินค้า
  const handleRemoveFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 7. 🚀 ฟังก์ชันสั่งซื้อ (ยิง API ไปหา Backend)
  const handleCheckout = async () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
      alert("ตะกร้าว่างเปล่า!");
      return;
    }

    if (!confirm(`ยืนยันการสั่งซื้อยอดรวม ฿${totalAmount} ใช่หรือไม่?`)) {
      return;
    }

    try {
      // แปลงโครงสร้างข้อมูลให้ตรงกับที่ Backend ต้องการ
      const orderData = {
        items: cart.map(item => ({
          fruitId: item.id,
          quantity: item.quantity
        }))
      };

      // ยิง API
      await axios.post('http://localhost:3000/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🎉 สั่งซื้อสำเร็จ! ขอบคุณที่อุดหนุนครับ");
      setCart([]);
      window.location.reload(); // รีโหลดเพื่ออัปเดตสต็อก

    } catch (error: any) {
      console.error("Checkout Error:", error);
      const message = error.response?.data?.message || "เกิดข้อผิดพลาด";
      alert(`❌ สั่งซื้อไม่สำเร็จ: ${message}`);
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
          
          <div style={{ flex: 1, minWidth: '350px' }}>
            <Cart 
              cart={cart} 
              onRemove={handleRemoveFromCart} 
              onCheckout={handleCheckout} 
              onIncrease={handleIncrease} 
              onDecrease={handleDecrease}
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