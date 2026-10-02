import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import AddForm from "./components/AddForm";
import CategoryNav from "./components/CategoryNav";
import SearchBox from "./components/SearchBox";
import Stats from "./components/Stats";
import TodoItem from "./components/TodoItem";
import { CATEGORIES, EMPTY_TEXT, FILTERS, makeInitialTodos } from "./constants";
import { todayISO } from "./utils/dates";

export default function App() {
  const [todos, setTodos] = useState(makeInitialTodos);
  const nextId = useRef(todos.length + 1);
  const [today, setToday] = useState(todayISO);

  const [filter, setFilter] = useState("all"); // status tab
  const [category, setCategory] = useState("all"); // sidebar
  const [query, setQuery] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  // Keep "today" fresh if the page stays open past midnight.
  useEffect(() => {
    const id = setInterval(() => setToday(todayISO()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ---------- derived data ---------- */

  const stats = useMemo(() => {
    const live = todos.filter((t) => !t.removing);
    const done = live.filter((t) => t.done).length;
    const overdue = live.filter((t) => !t.done && t.due && t.due < today).length;
    return { total: live.length, done, overdue, active: live.length - done - overdue };
  }, [todos, today]);

  const categoryCounts = useMemo(() => {
    const counts = { all: 0 };
    CATEGORIES.forEach((c) => (counts[c.id] = 0));
    todos.forEach((t) => {
      if (t.removing) return;
      counts.all += 1;
      counts[t.category] += 1;
    });
    return counts;
  }, [todos]);

  const q = query.trim().toLowerCase();

  // Category + search narrow the list; the status tab narrows it further.
  const scoped = todos.filter(
    (t) => (category === "all" || t.category === category) && (!q || t.text.toLowerCase().includes(q))
  );
  const scopedLive = scoped.filter((t) => !t.removing);
  const tabCounts = {
    all: scopedLive.length,
    active: scopedLive.filter((t) => !t.done).length,
    done: scopedLive.filter((t) => t.done).length,
  };
  const visible = scoped.filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true));

  const emptyMessage = () => {
    if (q) return `ไม่พบงานที่ตรงกับ “${query.trim()}”`;
    if (categoryCounts.all === 0) return EMPTY_TEXT.all;
    if (filter === "all") return "ยังไม่มีงานในหมวดนี้";
    return EMPTY_TEXT[filter];
  };

  /* ---------- actions ---------- */

  const addTodo = ({ text, priority, category: cat, due }) =>
    setTodos((prev) => [{ id: nextId.current++, text, done: false, priority, category: cat, due, fresh: true }, ...prev]);

  const patch = (id, changes) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, fresh: false, ...changes } : t)));

  const toggle = (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, fresh: false, done: !t.done } : t)));

  const cyclePriority = (id) =>
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const order = ["low", "mid", "high"];
        return { ...t, fresh: false, priority: order[(order.indexOf(t.priority) + 1) % order.length] };
      })
    );

  const cycleCategory = (id) =>
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const i = CATEGORIES.findIndex((c) => c.id === t.category);
        return { ...t, fresh: false, category: CATEGORIES[(i + 1) % CATEGORIES.length].id };
      })
    );

  const removeIds = (ids) => {
    setTodos((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, removing: true } : t)));
    setTimeout(() => setTodos((prev) => prev.filter((t) => !ids.includes(t.id))), 280);
  };
  const remove = (id) => removeIds([id]);
  const clearCompleted = () => removeIds(scopedLive.filter((t) => t.done).map((t) => t.id));

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setDraft(todo.text);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };
  const commitEdit = (id) => {
    if (editingId !== id) return;
    const v = draft.trim();
    if (v) patch(id, { text: v });
    cancelEdit();
  };

  /* ---------- view ---------- */

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">รายการงาน</h1>
        <p className="muted mt-1 text-sm">จดสิ่งที่ต้องทำ ตั้งวันกำหนดส่ง แล้วติ๊กเมื่อเสร็จ</p>
      </header>

      <div className="layout">
        <aside className="side">
          <CategoryNav value={category} counts={categoryCounts} onChange={setCategory} />
          <Stats stats={stats} />
        </aside>

        <div className="content">
          <AddForm filterCategory={category} onAdd={addTodo} />

          <div className="mb-3">
            <SearchBox value={query} onChange={setQuery} />
          </div>

          <div className="mb-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="กรองตามสถานะ">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className="tab"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="n">{tabCounts[f.id]}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="muted mx-auto mb-3 grid place-items-center">
                <ClipboardCheck size={36} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className="muted text-sm">{emptyMessage()}</p>
            </div>
          ) : (
            <ul className="list-none m-0 p-0">
              {visible.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  today={today}
                  editing={editingId === t.id}
                  draft={draft}
                  setDraft={setDraft}
                  onToggle={toggle}
                  onDelete={remove}
                  onStartEdit={startEdit}
                  onCommit={commitEdit}
                  onCancel={cancelEdit}
                  onCyclePriority={cyclePriority}
                  onCycleCategory={cycleCategory}
                  onSetDue={(id, due) => patch(id, { due })}
                />
              ))}
            </ul>
          )}

          <footer className="mt-1 flex items-center justify-between gap-3 px-1">
            <p className="muted text-sm" aria-live="polite">
              เหลือ {tabCounts.active} งานที่ยังไม่เสร็จ
            </p>
            <button className="link-btn" onClick={clearCompleted} disabled={tabCounts.done === 0}>
              ล้างงานที่เสร็จแล้ว{tabCounts.done > 0 ? " (" + tabCounts.done + ")" : ""}
            </button>
          </footer>

          <p className="muted mt-8 text-center text-xs">
            ดับเบิลคลิกที่ชื่องานเพื่อแก้ไข · กดป้ายความสำคัญ หมวดหมู่ หรือวันที่เพื่อเปลี่ยน
          </p>
        </div>
      </div>
    </main>
  );
}
