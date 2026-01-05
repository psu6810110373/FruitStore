import axios from 'axios';

// หน้าตาของสินค้าในตะกร้า (เหมือน Fruit แต่มี quantity เพิ่มมา)
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  token: string;
  onClearCart: () => void;
  onRemoveItem: (id: number) => void;
}

export default function Cart({ items, token, onClearCart, onRemoveItem }: CartProps) {
  
  // คำนวณราคารวมทั้งหมด
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ฟังก์ชันสั่งซื้อ (Checkout) ยิง API ไป Backend
  const handleCheckout = async () => {
    if (items.length === 0) return;

    // แปลงข้อมูลให้ตรงกับที่ Backend ต้องการ (items: [{ fruitId, quantity }])
    const orderData = {
      items: items.map(item => ({
        fruitId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      await axios.post('http://localhost:3000/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('✅ สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการครับ');
      onClearCart(); // ล้างตะกร้าหลังซื้อเสร็จ
    } catch (error) {
      console.error(error);
      alert('❌ สั่งซื้อล้มเหลว กรุณาลองใหม่');
    }
  };

  if (items.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>🛒 ตะกร้ายังว่างอยู่ครับ</div>;
  }

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginTop: 20, backgroundColor: '#f9f9f9' }}>
      <h2>🛒 ตะกร้าสินค้าของคุณ</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>สินค้า</th>
            <th style={{ padding: 8 }}>ราคา</th>
            <th style={{ padding: 8 }}>จำนวน</th>
            <th style={{ padding: 8 }}>รวม</th>
            <th style={{ padding: 8 }}>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{item.name}</td>
              <td style={{ padding: 8 }}>฿{item.price}</td>
              <td style={{ padding: 8 }}>x {item.quantity}</td>
              <td style={{ padding: 8 }}>฿{item.price * item.quantity}</td>
              <td style={{ padding: 8 }}>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <h3>ราคารวมทั้งสิ้น: <span style={{ color: 'green' }}>฿{totalPrice}</span></h3>
        <button 
          onClick={handleCheckout}
          style={{ 
            backgroundColor: '#28a745', color: 'white', border: 'none', 
            padding: '10px 20px', borderRadius: 5, fontSize: '1.1em', cursor: 'pointer' 
          }}
        >
          💳 ยืนยันการสั่งซื้อ
        </button>
      </div>
    </div>
  );
}