# Thai Todo (Vite + React + Tailwind)

แอปรายการงานภาษาไทย — React 18, Vite 6, Tailwind CSS 4, lucide-react

## เริ่มใช้งาน

```bash
npm install
npm run dev      # เปิด http://localhost:5173
npm run build    # สร้างไฟล์ production ที่ dist/
npm run preview  # ทดลองดูไฟล์ที่ build แล้ว
```

ต้องใช้ Node.js 18 ขึ้นไป

## โครงสร้าง

```
src/
  App.jsx               สถานะหลัก ฟอร์มเพิ่มงาน แท็บกรอง ส่วนท้าย
  components/TodoItem.jsx  การ์ดงานแต่ละรายการ (ติ๊ก แก้ไข ลบ ป้ายความสำคัญ)
  constants.js          ระดับความสำคัญ ข้อความ และข้อมูลตัวอย่าง
  index.css             Tailwind และดีไซน์โทเค็น (โหมดสว่าง/มืด)
```

ข้อมูลเก็บใน React state เท่านั้น (ไม่ใช้ localStorage) รีเฟรชแล้วข้อมูลจะรีเซ็ต
