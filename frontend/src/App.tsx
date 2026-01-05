import { useState, useEffect } from 'react';
import Login from './Login';
import FruitList from './FruitList';
import Cart, {type CartItem } from './Cart'; // 👈 import Cart มาใช้

function App() {
  const [token, setToken] = useState<string | null>(null);
  
  // 1. สร้าง State สำหรับเก็บตะกร้า
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // ตัวแปรสำหรับสลับหน้า (true=ดูตะกร้า, false=ดูสินค้า)
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.reload();
  };

  // 2. Logic เพิ่มของลงตะกร้า (หัวใจสำคัญ ❤️)
  const handleAddToCart = (fruit: any) => {
    setCart((prevCart) => {
      // เช็คว่ามีสินค้านี้ในตะกร้าหรือยัง?
      const existingItem = prevCart.find(item => item.id === fruit.id);

      if (existingItem) {
        // ถ้ามีแล้ว -> ให้บวกจำนวนเพิ่ม (+1)
        return prevCart.map(item =>
          item.id === fruit.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // ถ้ายังไม่มี -> เพิ่มสินค้าใหม่เข้าไป และเซ็ตจำนวนเป็น 1
        return [...prevCart, { id: fruit.id, name: fruit.name, price: fruit.price, quantity: 1 }];
      }
    });
    alert(`เพิ่ม ${fruit.name} ลงตะกร้าแล้ว! 🛒`);
  };

  // 3. Logic ลบของออกจากตะกร้า
  const handleRemoveFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h1 style={{ margin: 0, color: '#ff6b6b' }}>🍊 Fruit Store</h1>
        
        {token && (
          <div style={{ display: 'flex', gap: 10 }}>
             {/* ปุ่มสลับดูตะกร้า */}
            <button 
              onClick={() => setShowCart(!showCart)}
              style={{ padding: '8px 15px', borderRadius: 5, cursor: 'pointer', background: '#007bff', color: 'white', border: 'none' }}
            >
              {showCart ? '🏠 กลับหน้าร้าน' : `🛒 ตะกร้าสินค้า (${cart.reduce((a,b)=>a+b.quantity,0)})`}
            </button>

            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Logout 🚪
            </button>
          </div>
        )}
      </div>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div>
          {/* เลือกแสดงผลตามปุ่มที่กด */}
          {showCart ? (
             <Cart 
               items={cart} 
               token={token} 
               onClearCart={() => setCart([])} 
               onRemoveItem={handleRemoveFromCart}
             />
          ) : (
             <FruitList token={token} onAddToCart={handleAddToCart} />
          )}
        </div>
      )}

    </div>
  );
}

export default App;