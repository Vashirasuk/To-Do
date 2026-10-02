const pad = (n) => String(n).padStart(2, "0");

/** Local date -> "YYYY-MM-DD" (the same format <input type="date"> uses). */
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());

export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

/** "overdue" | "today" | "future" | "done" | null. Finished tasks are never overdue. */
export function dueState(due, done, today) {
  if (!due) return null;
  if (done) return "done";
  if (due < today) return "overdue"; // ISO strings compare correctly as text
  if (due === today) return "today";
  return "future";
}

/** "2026-10-05" -> "5 ต.ค." (adds the year only when it is not the current year). */
export function formatDue(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const sameYear = y === new Date().getFullYear();
  return new Date(y, m - 1, d).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}
