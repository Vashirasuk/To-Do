export const PRIORITIES = {
  low: { label: "ต่ำ", cls: "low", dot: "var(--low-bar)" },
  mid: { label: "กลาง", cls: "mid", dot: "var(--mid-bar)" },
  high: { label: "สูง", cls: "high", dot: "var(--high-bar)" },
};

export const ORDER = ["low", "mid", "high"];

export const FILTERS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "active", label: "ยังไม่เสร็จ" },
  { id: "done", label: "เสร็จแล้ว" },
];

export const EMPTY_TEXT = {
  all: "ยังไม่มีงาน เพิ่มงานแรกของคุณด้านบนได้เลย",
  active: "ไม่มีงานที่ค้างอยู่ ทำได้ดีมาก",
  done: "ยังไม่มีงานที่เสร็จ",
};

export const INITIAL_TODOS = [
  { id: 1, text: "ส่งรายงานประจำสัปดาห์ให้หัวหน้า", done: false, priority: "high" },
  { id: 2, text: "ซื้อของเข้าบ้าน นม ไข่ ผัก", done: false, priority: "mid" },
  { id: 3, text: "โทรนัดหมอฟัน", done: true, priority: "low" },
];
