// frontend/src/MyOrders.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

// กำหนดหน้าตาของข้อมูล Order (ให้ตรงกับ Backend)
interface OrderItem {
  id: number;
  quantity: number;
  price_at_purchase: number;
  fruit: {
    name: string;
    price: number;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface MyOrdersProps {
  token: string;
  onBack: () => void; // ฟังก์ชันกดกลับหน้าหลัก
  onPay: (order: any) => void; //รับ props เพิ่ม
}

export default function MyOrders({ token, onBack, onPay }: MyOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลประวัติการสั่งซื้อ
    axios.get('http://localhost:3000/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrders(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <p style={{ padding: 20 }}>กำลังโหลดข้อมูล... ⏳</p>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ marginBottom: 20, padding: '8px 15px', background: '#ddd', border: 'none', borderRadius: 5, cursor: 'pointer' }}
      >
        ⬅️ กลับไปเลือกซื้อสินค้า
      </button>

      <h2>📜 ประวัติการสั่งซื้อของฉัน</h2>

      {orders.length === 0 ? (
        <p style={{ color: '#888' }}>คุณยังไม่มีประวัติการสั่งซื้อเลย</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map((order) => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 20, background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              
              {/* หัวตาราง: วันที่ + สถานะ + ราคารวม */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 10 }}>
                <div>
                  <strong>Order #{order.id}</strong>
                  <span style={{ marginLeft: 10, fontSize: '0.9em', color: '#666' }}>
                    {new Date(order.created_at).toLocaleString('th-TH')}
                  </span>
                </div>
                <div>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: 5, fontSize: '0.8em', marginRight: 10,
                    background: order.status === 'PENDING' ? '#fff3cd' : '#d4edda',
                    color: order.status === 'PENDING' ? '#856404' : '#155724'
                  }}>
                    {order.status}
                  </span>
                  <strong style={{ color: 'green' }}>฿{order.total}</strong>
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => onPay(order)}
                      style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 5, padding: '8px 10px', cursor: 'pointer', fontSize: '0.8em', marginLeft: 10 }}
                    >
                      แจ้งชำระเงิน 💸
                    </button>
                  )}
                </div>
              </div>

              {/* รายการสินค้าข้างใน */}
              <ul style={{ paddingLeft: 20, margin: 0, color: '#555' }}>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.fruit.name} (x{item.quantity}) - {item.price_at_purchase * item.quantity} บาท
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}