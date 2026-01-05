import { useState, useEffect } from 'react';
import axios from 'axios';

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
  isAdmin: boolean; // ✅ รับค่า Admin
}

export default function FruitList({ token, onAddToCart, isAdmin }: FruitListProps) {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับฟอร์มเพิ่มสินค้า
  const [isAdding, setIsAdding] = useState(false);
  const [newFruit, setNewFruit] = useState({ name: '', description: '', price: 0, stock: 0 });

  useEffect(() => {
    fetchFruits();
  }, [token]);

  const fetchFruits = () => {
    axios.get('http://localhost:3000/fruits', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFruits(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  // 🚀 ฟังก์ชันเพิ่มสินค้า (Add)
  const handleAddFruit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/fruits', newFruit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // เพิ่มเสร็จ อัปเดตหน้าจอทันที
      setFruits([...fruits, res.data]);
      setIsAdding(false); // ปิดฟอร์ม
      setNewFruit({ name: '', description: '', price: 0, stock: 0 }); // รีเซ็ตค่า
      alert('เพิ่มสินค้าสำเร็จ! 🍏');
    } catch (err) {
      alert('เพิ่มสินค้าไม่สำเร็จ');
    }
  };

  // 🗑️ ฟังก์ชันลบสินค้า (Delete)
  const handleDelete = async (id: number) => {
    if (!confirm('⚠️ แน่ใจนะว่าจะลบรายการนี้?')) return;
    try {
      await axios.delete(`http://localhost:3000/fruits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFruits(prev => prev.filter(f => f.id !== id)); // เอาออกจากหน้าจอ
      alert('ลบเรียบร้อย! 🗑️');
    } catch (err) {
      alert('ลบไม่ได้ (อาจมีประวัติการสั่งซื้อค้างอยู่)');
    }
  };

  if (loading) return <p>กำลังโหลดสินค้า... ⏳</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>🍎 รายการผลไม้สดๆ</h2>
        
        {/* 👑 ปุ่มเปิดฟอร์มเพิ่มสินค้า (เห็นเฉพาะ Admin) */}
        {isAdmin && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}
          >
            + เพิ่มสินค้าใหม่
          </button>
        )}
      </div>

      {/* 📝 ฟอร์มเพิ่มสินค้า (แสดงเมื่อกดปุ่ม + และเป็น Admin) */}
      {isAdmin && isAdding && (
        <div style={{ marginBottom: 20, padding: 15, border: '1px solid #28a745', borderRadius: 10, background: '#f0fff4' }}>
          <h3>✨ เพิ่มสินค้าใหม่</h3>
          <form onSubmit={handleAddFruit} style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <input type="text" placeholder="ชื่อสินค้า" required 
              value={newFruit.name} onChange={e => setNewFruit({...newFruit, name: e.target.value})} 
              style={{ padding: 8 }} />
            <input type="number" placeholder="ราคา" required 
              value={newFruit.price || ''} onChange={e => setNewFruit({...newFruit, price: +e.target.value})} 
              style={{ padding: 8 }} />
            <input type="number" placeholder="จำนวนในสต็อก" required 
              value={newFruit.stock || ''} onChange={e => setNewFruit({...newFruit, stock: +e.target.value})} 
              style={{ padding: 8 }} />
            <input type="text" placeholder="คำอธิบาย" required 
              value={newFruit.description} onChange={e => setNewFruit({...newFruit, description: e.target.value})} 
              style={{ padding: 8 }} />
            
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" style={{ flex: 1, background: '#28a745', color: 'white', border: 'none', padding: 10, borderRadius: 5, cursor: 'pointer' }}>บันทึก</button>
              <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, background: '#ccc', border: 'none', padding: 10, borderRadius: 5, cursor: 'pointer' }}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}
      
      {/* ตารางสินค้า */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {fruits.map(fruit => (
          <div key={fruit.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative', background: '#fff' }}>
            
            {/* 👑 ปุ่มลบ (เห็นเฉพาะ Admin) */}
            {isAdmin && (
              <button 
                onClick={() => handleDelete(fruit.id)}
                style={{
                  position: 'absolute', top: 5, right: 5,
                  background: '#ff4d4d', color: 'white', border: 'none',
                  borderRadius: '50%', width: 24, height: 24, cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '12px', lineHeight: '24px', padding: 0
                }}
                title="ลบสินค้า"
              >
                ✕
              </button>
            )}

            <h3>{fruit.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9em' }}>{fruit.description}</p>
            <div style={{ margin: '10px 0' }}>
              <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'green' }}>฿{fruit.price}</span>
            </div>
            <p style={{ fontSize: '0.8em', marginBottom: 15 }}>คงเหลือ: {fruit.stock}</p>
            
            <button 
              onClick={() => onAddToCart(fruit)}
              disabled={fruit.stock <= 0}
              style={{
                backgroundColor: fruit.stock > 0 ? '#ff9800' : '#ccc',
                color: 'white', border: 'none', padding: '8px 15px',
                borderRadius: '5px', cursor: fruit.stock > 0 ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              {fruit.stock > 0 ? 'ใส่ตะกร้า 🛒' : 'สินค้าหมด'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}