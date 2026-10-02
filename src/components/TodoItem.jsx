import { useEffect, useRef } from "react";
import { Calendar, CalendarPlus, Check, Trash2 } from "lucide-react";
import { CATEGORY_BY_ID, PRIORITIES } from "../constants";
import { dueState, formatDue } from "../utils/dates";

export default function TodoItem({
  todo,
  today,
  editing,
  draft,
  setDraft,
  onToggle,
  onDelete,
  onStartEdit,
  onCommit,
  onCancel,
  onCyclePriority,
  onCycleCategory,
  onSetDue,
}) {
  const inputRef = useRef(null);
  const dateRef = useRef(null);
  const p = PRIORITIES[todo.priority];
  const cat = CATEGORY_BY_ID[todo.category];
  const CatIcon = cat.icon;
  const state = dueState(todo.due, todo.done, today);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const openPicker = () => {
    const el = dateRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {
        /* fall through */
      }
    }
    el.focus();
    el.click();
  };

  let dueLabel = "ตั้งวันที่";
  let dueAria = "ตั้งวันกำหนดส่ง";
  if (todo.due) {
    const d = formatDue(todo.due);
    dueLabel = state === "overdue" ? "เลยกำหนด " + d : state === "today" ? "วันนี้" : d;
    dueAria = "กำหนดส่ง " + d + (state === "overdue" ? " เลยกำหนดแล้ว" : state === "today" ? " ตรงกับวันนี้" : "") + " กดเพื่อเปลี่ยน";
  }
  const DueIcon = todo.due ? Calendar : CalendarPlus;

  return (
    <li className={"row" + (todo.removing ? " removing" : "") + (todo.fresh ? " enter" : "")}>
      <div className="row-inner">
        <div className={"card item p-" + p.cls}>
          <button
            className="check"
            role="checkbox"
            aria-checked={todo.done}
            aria-label={(todo.done ? "ยกเลิกเสร็จ: " : "ทำเสร็จแล้ว: ") + todo.text}
            onClick={() => onToggle(todo.id)}
          >
            <Check size={15} strokeWidth={3} aria-hidden="true" />
          </button>

          <div className="body">
            {editing ? (
              <input
                ref={inputRef}
                className="field"
                style={{ padding: "6px 10px" }}
                value={draft}
                maxLength={120}
                aria-label="แก้ไขงาน"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCommit(todo.id);
                  if (e.key === "Escape") onCancel();
                }}
                onBlur={() => onCommit(todo.id)}
              />
            ) : (
              <span
                className={"title" + (todo.done ? " done" : "")}
                onDoubleClick={() => onStartEdit(todo)}
                title="ดับเบิลคลิกเพื่อแก้ไข"
              >
                {todo.text}
              </span>
            )}

            <div className="meta">
              <button
                className={"badge " + p.cls}
                onClick={() => onCyclePriority(todo.id)}
                title="กดเพื่อเปลี่ยนความสำคัญ"
                aria-label={"ความสำคัญ" + p.label + " กดเพื่อเปลี่ยน"}
              >
                {p.label}
              </button>

              <button
                className="tag"
                onClick={() => onCycleCategory(todo.id)}
                title="กดเพื่อเปลี่ยนหมวดหมู่"
                aria-label={"หมวดหมู่" + cat.label + " กดเพื่อเปลี่ยน"}
              >
                <CatIcon size={12} aria-hidden="true" />
                {cat.label}
              </button>

              <span className="due-wrap">
                <button
                  className={"due " + (state || "none")}
                  onClick={openPicker}
                  title="เลือกวันกำหนดส่ง"
                  aria-label={dueAria}
                >
                  <DueIcon size={13} aria-hidden="true" />
                  {dueLabel}
                </button>
                <input
                  ref={dateRef}
                  type="date"
                  className="ghost-date"
                  tabIndex={-1}
                  aria-hidden="true"
                  value={todo.due || ""}
                  onChange={(e) => onSetDue(todo.id, e.target.value || null)}
                />
              </span>
            </div>
          </div>

          <button className="icon-btn" onClick={() => onDelete(todo.id)} aria-label={"ลบ: " + todo.text}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
