import React from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onRemove: (id: number) => void;
  onCheckout: () => void;
  onIncrease: (id: number) => void; // 👈 รับ function มา
  onDecrease: (id: number) => void; // 👈 รับ function มา
}

export default function Cart({ cart, onRemove, onCheckout, onIncrease, onDecrease }: CartProps) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div style={{ marginTop: 20, padding: 30, border: '2px dashed #ccc', borderRadius: 10, textAlign: 'center', color: '#999' }}>
        <h3>ตะกร้าว่างเปล่า 🛒</h3>
        <p>ไปเลือกผลไม้กันเถอะ!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 0, padding: 20, border: '1px solid #ddd', borderRadius: 10, backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: 15, marginTop: 0 }}>🛒 ตะกร้าของฉัน</h2>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cart.map(item => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #f0f0f0' }}>
            
            {/* ชื่อสินค้า */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{item.name}</div>
              <div style={{ color: '#888', fontSize: '0.9em' }}>@{item.price} บาท</div>
            </div>

            {/* 🎮 ปุ่มปรับจำนวน */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '15px' }}>
              <button 
                onClick={() => onDecrease(item.id)}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#ff4d4d' }}
              >
                -
              </button>
              
              <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
              
              <button 
                onClick={() => onIncrease(item.id)}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 'bold', color: '#28a745' }}
              >
                +
              </button>
            </div>

            {/* ราคารวมของชิ้นนั้น & ปุ่มลบ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>฿{item.price * item.quantity}</span>
              <button 
                onClick={() => onRemove(item.id)} 
                style={{ background: 'transparent', color: '#999', border: 'none', cursor: 'pointer', fontSize: '0.8em', textDecoration: 'underline' }}
              >
                ลบ
              </button>
            </div>

          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 25, fontSize: '1.2em', fontWeight: 'bold', borderTop: '2px solid #eee', paddingTop: 15 }}>
        <span>ยอดรวมทั้งหมด:</span>
        <span style={{ color: '#28a745', fontSize: '1.3em' }}>฿{total}</span>
      </div>

      <button 
        onClick={onCheckout} 
        style={{ width: '100%', marginTop: 20, padding: 15, background: 'linear-gradient(to right, #28a745, #218838)', color: 'white', border: 'none', borderRadius: 8, fontSize: '1.1em', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)' }}
      >
        ยืนยันการสั่งซื้อ (Checkout) ✅
      </button>
    </div>
  );
}