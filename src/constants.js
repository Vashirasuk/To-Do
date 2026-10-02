import { Briefcase, HeartPulse, ShoppingCart, User } from "lucide-react";
import { addDays } from "./utils/dates";

export const PRIORITIES = {
  low: { label: "ต่ำ", cls: "low", dot: "var(--low-bar)" },
  mid: { label: "กลาง", cls: "mid", dot: "var(--mid-bar)" },
  high: { label: "สูง", cls: "high", dot: "var(--high-bar)" },
};
export const ORDER = ["low", "mid", "high"];

export const CATEGORIES = [
  { id: "work", label: "งาน", icon: Briefcase },
  { id: "personal", label: "ส่วนตัว", icon: User },
  { id: "shopping", label: "ช้อปปิ้ง", icon: ShoppingCart },
  { id: "health", label: "สุขภาพ", icon: HeartPulse },
];
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

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

// Dates are relative to today so the demo always shows overdue / today / upcoming.
export const makeInitialTodos = () => [
  { id: 1, text: "ส่งรายงานประจำสัปดาห์ให้หัวหน้า", done: false, priority: "high", category: "work", due: addDays(-1) },
  { id: 2, text: "ซื้อของเข้าบ้าน นม ไข่ ผัก", done: false, priority: "mid", category: "shopping", due: addDays(0) },
  { id: 3, text: "โทรนัดหมอฟัน", done: true, priority: "low", category: "health", due: addDays(-2) },
  { id: 4, text: "เตรียมสไลด์ประชุมทีม", done: false, priority: "mid", category: "work", due: addDays(2) },
  { id: 5, text: "วิ่งสวนสาธารณะ 30 นาที", done: false, priority: "low", category: "health", due: addDays(1) },
  { id: 6, text: "โทรหาคุณแม่", done: false, priority: "low", category: "personal", due: null },
];
