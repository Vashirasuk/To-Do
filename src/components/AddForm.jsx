import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES, ORDER, PRIORITIES } from "../constants";

export default function AddForm({ filterCategory, onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("mid");
  const [category, setCategory] = useState("work");
  const [due, setDue] = useState("");

  // When a category is selected in the sidebar, new tasks default to it.
  useEffect(() => {
    if (filterCategory !== "all") setCategory(filterCategory);
  }, [filterCategory]);

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onAdd({ text: v, priority, category, due: due || null });
    setText("");
    setDue("");
  };

  return (
    <section className="card p-4 mb-5" aria-label="เพิ่มงานใหม่">
      <div className="flex gap-2">
        <input
          className="field"
          value={text}
          maxLength={120}
          placeholder="มีอะไรต้องทำบ้าง"
          aria-label="ชื่องานใหม่"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) submit();
          }}
        />
        <button className="btn-primary" onClick={submit} disabled={!text.trim()}>
          <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
          เพิ่มงาน
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="seg" role="group" aria-label="ความสำคัญ">
          {ORDER.map((k) => (
            <button key={k} aria-pressed={priority === k} onClick={() => setPriority(k)}>
              <span className="dot" style={{ background: PRIORITIES[k].dot }} />
              {PRIORITIES[k].label}
            </button>
          ))}
        </div>

        <select
          className="field field-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="หมวดหมู่"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <label className="datefield">
          <span>กำหนดส่ง</span>
          <input
            type="date"
            className="field field-sm"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
