import { useEffect, useRef } from "react";
import { Check, Trash2 } from "lucide-react";
import { PRIORITIES } from "../constants";

export default function TodoItem({
  todo,
  editing,
  draft,
  setDraft,
  onToggle,
  onDelete,
  onStartEdit,
  onCommit,
  onCancel,
  onCyclePriority,
}) {
  const inputRef = useRef(null);
  const p = PRIORITIES[todo.priority];

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

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

          <button
            className={"badge " + p.cls}
            onClick={() => onCyclePriority(todo.id)}
            title="กดเพื่อเปลี่ยนความสำคัญ"
            aria-label={"ความสำคัญ" + p.label + " กดเพื่อเปลี่ยน"}
          >
            {p.label}
          </button>

          <button className="icon-btn" onClick={() => onDelete(todo.id)} aria-label={"ลบ: " + todo.text}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}
