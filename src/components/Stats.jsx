const R = 15.9155; // circumference = 100, so dash lengths are plain percentages

function Donut({ segments, total, percent }) {
  let offset = 25; // start at 12 o'clock
  return (
    <div className="donut">
      <svg viewBox="0 0 42 42" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        <circle cx="21" cy="21" r={R} fill="none" stroke="var(--line)" strokeWidth="5" />
        {total > 0 &&
          segments.map((s) => {
            const pct = (s.value / total) * 100;
            const circle =
              pct > 0 ? (
                <circle
                  key={s.key}
                  cx="21"
                  cy="21"
                  r={R}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="5"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={offset}
                />
              ) : null;
            offset -= pct;
            return circle;
          })}
      </svg>
      <div className="donut-center">
        <b>{percent}%</b>
        <span>เสร็จ</span>
      </div>
    </div>
  );
}

export default function Stats({ stats }) {
  const { total, done, active, overdue } = stats;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const segments = [
    { key: "done", label: "เสร็จแล้ว", value: done, color: "var(--low-bar)" },
    { key: "active", label: "ค้างอยู่", value: active, color: "var(--accent)" },
    { key: "overdue", label: "เลยกำหนด", value: overdue, color: "var(--high-bar)" },
  ];

  return (
    <section className="card p-4" aria-label="สถิติ">
      <h2 className="side-title-always">สถิติ</h2>
      <div className="flex items-center gap-4">
        <Donut segments={segments} total={total} percent={percent} />
        <div className="min-w-0 flex-1">
          <p className="leading-none">
            <span className="text-2xl font-bold tabular-nums">{total}</span>{" "}
            <span className="muted text-sm">งานทั้งหมด</span>
          </p>
          <ul className="legend">
            {segments.map((s) => (
              <li key={s.key}>
                <span className="dot" style={{ background: s.color }} />
                <span>{s.label}</span>
                <span className="legend-n">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
