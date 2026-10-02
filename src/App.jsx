import { useMemo, useRef, useState } from "react";
import { ClipboardCheck, Plus } from "lucide-react";
import TodoItem from "./components/TodoItem";
import { EMPTY_TEXT, FILTERS, INITIAL_TODOS, ORDER, PRIORITIES } from "./constants";

export default function App() {
  const nextId = useRef(INITIAL_TODOS.length + 1);
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("mid");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const counts = useMemo(() => {
    const live = todos.filter((t) => !t.removing);
    const done = live.filter((t) => t.done).length;
    return { all: live.length, active: live.length - done, done };
  }, [todos]);

  const visible = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const addTodo = () => {
    const v = text.trim();
    if (!v) return;
    setTodos((prev) => [{ id: nextId.current++, text: v, done: false, priority, fresh: true }, ...prev]);
    setText("");
  };

  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done, fresh: false } : t)));

  const removeIds = (ids) => {
    setTodos((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, removing: true } : t)));
    setTimeout(() => setTodos((prev) => prev.filter((t) => !ids.includes(t.id))), 280);
  };
  const remove = (id) => removeIds([id]);
  const clearCompleted = () => removeIds(todos.filter((t) => t.done && !t.removing).map((t) => t.id));

  const cyclePriority = (id) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, fresh: false, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % ORDER.length] }
          : t
      )
    );

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
    if (v) setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: v, fresh: false } : t)));
    cancelEdit();
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">รายการงาน</h1>
        <p className="muted mt-1 text-sm">จดสิ่งที่ต้องทำ แล้วติ๊กเมื่อเสร็จ</p>
      </header>

      {/* Add */}
      <section className="card p-4 mb-5" aria-label="เพิ่มงานใหม่">
        <input
          className="field"
          value={text}
          maxLength={120}
          placeholder="มีอะไรต้องทำบ้าง"
          aria-label="ชื่องานใหม่"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) addTodo();
          }}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="seg" role="group" aria-label="ความสำคัญ">
            {ORDER.map((k) => (
              <button key={k} aria-pressed={priority === k} onClick={() => setPriority(k)}>
                <span className="dot" style={{ background: PRIORITIES[k].dot }} />
                {PRIORITIES[k].label}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={addTodo} disabled={!text.trim()}>
            <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
            เพิ่มงาน
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="mb-3 flex gap-1 overflow-x-auto" role="tablist" aria-label="กรองรายการ">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="tab"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="n">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="muted mx-auto mb-3 grid place-items-center">
            <ClipboardCheck size={36} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="muted text-sm">{EMPTY_TEXT[filter]}</p>
        </div>
      ) : (
        <ul className="list-none m-0 p-0">
          {visible.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              editing={editingId === t.id}
              draft={draft}
              setDraft={setDraft}
              onToggle={toggle}
              onDelete={remove}
              onStartEdit={startEdit}
              onCommit={commitEdit}
              onCancel={cancelEdit}
              onCyclePriority={cyclePriority}
            />
          ))}
        </ul>
      )}

      {/* Footer */}
      <footer className="mt-2 flex items-center justify-between gap-3 px-1">
        <p className="muted text-sm" aria-live="polite">
          เหลือ {counts.active} งานที่ยังไม่เสร็จ
        </p>
        <button className="link-btn" onClick={clearCompleted} disabled={counts.done === 0}>
          ล้างงานที่เสร็จแล้ว{counts.done > 0 ? " (" + counts.done + ")" : ""}
        </button>
      </footer>

      <p className="muted mt-8 text-center text-xs">
        ดับเบิลคลิกที่ชื่องานเพื่อแก้ไข · กดป้ายความสำคัญเพื่อเปลี่ยนระดับ
      </p>
    </main>
  );
}
