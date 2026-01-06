import { useState } from 'react';
import axios from 'axios';

interface PaymentProps {
  token: string;
  order: any; // รับข้อมูลออเดอร์ที่จะจ่ายมา
  onBack: () => void;
  onSuccess: () => void;
}

export default function Payment({ token, order, onBack, onSuccess }: PaymentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("กรุณาแนบสลิปก่อนครับ");
    if (!confirm("ยืนยันการแจ้งชำระเงิน?")) return;

    setUploading(true);

    try {
      // 1. เตรียมข้อมูลรูปภาพ (FormData)
      const formData = new FormData();
      formData.append('file', file); // 'file' ต้องตรงกับที่ Backend รอรับ

      // 2. ยิง API
      await axios.post(`http://localhost:3000/orders/${order.id}/upload-slip`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // สำคัญมาก! บอกว่าเป็นการส่งไฟล์
        },
      });

      alert("✅ แจ้งชำระเงินเรียบร้อย! กรุณารอแอดมินตรวจสอบ");
      onSuccess(); // กลับไปหน้าประวัติ

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', padding: 20, border: '1px solid #ddd', borderRadius: 10, textAlign: 'center' }}>
      <button onClick={onBack} style={{ float: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>⬅️ ยกเลิก</button>
      
      <h2>💸 ชำระเงิน (Order #{order.id})</h2>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>ยอดชำระ: <span style={{ color: 'green' }}>฿{order.total}</span></p>

      <div style={{ margin: '20px 0', padding: 20, background: '#f9f9f9', borderRadius: 10 }}>
        {/* รูป QR Code จำลอง (เอาภาพจริงมาใส่แทน src ได้เลย) */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
          alt="QR Code" 
          style={{ width: 150, height: 150 }} 
        />
        <p>ธนาคาร: <b>Fruit Bank</b></p>
        <p>เลขบัญชี: <b>123-456-7890</b></p>
        <p>ชื่อบัญชี: <b>นายผลไม้ สดเสมอ</b></p>
      </div>

      <div style={{ textAlign: 'left' }}>
        <label>แนบหลักฐานการโอน (สลิป):</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          style={{ display: 'block', marginTop: 10, marginBottom: 20 }}
        />
      </div>

      <button 
        onClick={handleSubmit}
        disabled={uploading}
        style={{ 
          width: '100%', padding: 12, background: '#007bff', color: 'white', 
          border: 'none', borderRadius: 5, fontSize: '1.1em', cursor: uploading ? 'not-allowed' : 'pointer' 
        }}
      >
        {uploading ? 'กำลังอัปโหลด... ⏳' : 'แจ้งชำระเงิน 📤'}
      </button>
    </div>
  );
}