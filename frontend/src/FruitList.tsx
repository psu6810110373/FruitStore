import { useState, useEffect } from 'react';
import axios from 'axios';

// กำหนดหน้าตาข้อมูลผลไม้
interface Fruit {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface FruitListProps {
  token: string;
  onAddToCart: (fruit: Fruit) => void;
}

export default function FruitList({ token, onAddToCart }: FruitListProps) {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(''); // ตัวแปรเก็บ Error Message

  useEffect(() => {
    // Debug: เช็คว่า Token ถูกส่งมาจริงไหม
    console.log("Token ที่ได้รับใน FruitList:", token);

    axios.get('http://localhost:3000/fruits', {
      headers: { Authorization: `Bearer ${token}` } // ส่ง Token ไปยืนยันตัวตน
    })
    .then(response => {
      console.log("ข้อมูลที่ได้จาก Backend:", response.data);
      setFruits(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("เกิด Error ในการดึงข้อมูล:", error);
      
      // สร้างข้อความ Error ที่อ่านรู้เรื่อง
      let msg = "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
      if (error.response) {
        // Backend ตอบกลับมา (เช่น 401 Unauthorized)
        msg = `Backend Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        // ยิงไปไม่ถึง Backend (เช่น Backend ปิดอยู่ หรือติด CORS)
        msg = "ติดต่อ Server ไม่ได้ (Network Error) - กรุณาเช็คว่ารัน Backend อยู่หรือไม่";
      } else {
        msg = error.message;
      }
      setErrorMsg(msg);
      setLoading(false);
    });
  }, [token]);

  // สถานะ 1: กำลังโหลด
  if (loading) return <p style={{ padding: 20 }}>กำลังโหลดสินค้า... ⏳</p>;

  // สถานะ 2: เกิด Error (โชว์กล่องแดง)
  if (errorMsg) {
    return (
      <div style={{ border: '2px solid red', padding: 20, margin: 20, borderRadius: 10, backgroundColor: '#fff0f0' }}>
        <h3 style={{ color: 'red' }}>🚨 เกิดปัญหาในการดึงข้อมูล!</h3>
        <p><strong>รายละเอียด:</strong> {errorMsg}</p>
        <p><strong>Token ปัจจุบัน:</strong> {token ? `${token.substring(0, 15)}...` : 'ไม่มี Token (ว่างเปล่า)'}</p>
        <p style={{ fontSize: '0.8em', color: '#666' }}>ลองกด Logout แล้ว Login ใหม่ดูนะครับ</p>
      </div>
    );
  }

  // สถานะ 3: โหลดเสร็จแต่ไม่มีของ
  if (fruits.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <p>ไม่พบสินค้าในระบบ (Database ว่างเปล่า)</p>
        <p>👉 ลองไปเพิ่มสินค้าใน Postman ก่อนนะครับ</p>
      </div>
    );
  }

  // สถานะ 4: แสดงรายการสินค้า (ปกติ)
  return (
    <div style={{ padding: 20 }}>
      <h2>🍎 รายการผลไม้สดๆ ({fruits.length} รายการ)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {fruits.map(fruit => (
          <div key={fruit.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>{fruit.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>{fruit.description}</p>
            <div style={{ margin: '15px 0' }}>
              <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'green' }}>฿{fruit.price}</span>
            </div>
            <p style={{ fontSize: '0.8em', marginBottom: 15 }}>คงเหลือ: {fruit.stock}</p>
            
            <button 
              onClick={() => onAddToCart(fruit)}
              disabled={fruit.stock <= 0}
              style={{
                backgroundColor: fruit.stock > 0 ? '#ff9800' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: fruit.stock > 0 ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              {fruit.stock > 0 ? 'ใส่ตะกร้า 🛒' : 'สินค้าหมด ❌'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}