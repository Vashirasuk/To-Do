import { ListTodo } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function CategoryNav({ value, counts, onChange }) {
  const items = [{ id: "all", label: "ทั้งหมด", icon: ListTodo }, ...CATEGORIES];

  return (
    <nav className="catnav" aria-label="หมวดหมู่">
      <h2 className="side-title">หมวดหมู่</h2>
      {items.map((c) => {
        const Icon = c.icon;
        return (
          <button key={c.id} className="cat" aria-pressed={value === c.id} onClick={() => onChange(c.id)}>
            <Icon size={16} aria-hidden="true" />
            <span>{c.label}</span>
            <span className="cat-n">{counts[c.id] ?? 0}</span>
          </button>
        );
      })}
    </nav>
  );
}
