import { Search, X } from "lucide-react";

export default function SearchBox({ value, onChange }) {
  return (
    <div className="searchbox">
      <Search className="s-icon" size={18} aria-hidden="true" />
      <input
        className="field"
        type="text"
        inputMode="search"
        value={value}
        placeholder="ค้นหางาน"
        aria-label="ค้นหางาน"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onChange("");
        }}
      />
      {value && (
        <button className="s-clear" onClick={() => onChange("")} aria-label="ล้างคำค้นหา">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
