// frontend/src/AdminOrders.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface AdminOrdersProps {
  token: string;
  onBack: () => void;
}

export default function AdminOrders({ token, onBack }: AdminOrdersProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลออเดอร์ทั้งหมด
  const fetchOrders = () => {
    setLoading(true);
    axios.get('http://localhost:3000/orders/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setOrders(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      alert("โหลดข้อมูลไม่สำเร็จ (คุณไม่ใช่ Admin)");
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ฟังก์ชันกดอนุมัติ
  const handleApprove = async (orderId: number) => {
    if (!confirm(`ยืนยันการอนุมัติ Order #${orderId}?`)) return;

    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ อนุมัติเรียบร้อย!");
      fetchOrders(); // โหลดข้อมูลใหม่เพื่อให้สถานะอัปเดต
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // แยกออเดอร์เป็น 2 กลุ่ม: รอตรวจสอบ vs อื่นๆ
  const pendingOrders = orders.filter(o => o.status === 'WAITING_VERIFY');
  const otherOrders = orders.filter(o => o.status !== 'WAITING_VERIFY');

  if (loading) return <p style={{ padding: 20 }}>กำลังโหลดข้อมูล... ⏳</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: 20, cursor: 'pointer' }}>⬅️ กลับหน้าร้าน</button>
      
      <h2 style={{ color: '#ff9800' }}> จัดการคำสั่งซื้อ (Admin)</h2>

      {/* 🔴 ส่วนที่ 1: รายการรอตรวจสอบ (สำคัญสุด) */}
      <div style={{ marginBottom: 40 }}>
        <h3>🚨 รอตรวจสอบสลิป ({pendingOrders.length})</h3>
        {pendingOrders.length === 0 ? <p style={{color:'#888'}}>ไม่มีรายการที่ต้องตรวจ</p> : (
          <div style={{ display: 'grid', gap: 20 }}>
            {pendingOrders.map(order => (
              <div key={order.id} style={{ border: '2px solid #ff9800', borderRadius: 10, padding: 15, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <strong>Order #{order.id} (ลูกค้า: {order.user?.username || 'Unknown'})</strong>
                  <strong style={{ color: 'green' }}>฿{order.total}</strong>
                </div>

                {/* โชว์รูปสลิป */}
                {order.slip_image ? (
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ margin: 0, fontSize: '0.9em' }}>หลักฐานการโอน:</p>
                    <a href={`http://localhost:3000/uploads/${order.slip_image}`} target="_blank" rel="noreferrer">
                      <img 
                        src={`http://localhost:3000/uploads/${order.slip_image}`} 
                        alt="Slip" 
                        style={{ height: 100, border: '1px solid #ccc', marginTop: 5, cursor: 'zoom-in' }} 
                      />
                    </a>
                  </div>
                ) : <p style={{ color: 'red' }}>❌ ไม่พบรูปสลิป</p>}

                <button 
                  onClick={() => handleApprove(order.id)}
                  style={{ width: '100%', padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✅ ตรวจสอบแล้ว / อนุมัติ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ⚫ ส่วนที่ 2: ประวัติทั้งหมด */}
      <div>
        <h3>📜 ประวัติรายการอื่นๆ</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
          <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>ID</th>
              <th style={{ padding: 8 }}>ลูกค้า</th>
              <th style={{ padding: 8 }}>สถานะ</th>
              <th style={{ padding: 8 }}>ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {otherOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>#{order.id}</td>
                <td style={{ padding: 8 }}>{order.user?.username}</td>
                <td style={{ padding: 8 }}>
                   <span style={{ 
                      padding: '2px 6px', borderRadius: 4, fontSize: '0.85em',
                      background: order.status === 'COMPLETED' ? '#d4edda' : '#f8f9fa',
                      color: order.status === 'COMPLETED' ? '#155724' : '#666'
                   }}>
                     {order.status}
                   </span>
                </td>
                <td style={{ padding: 8 }}>{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}