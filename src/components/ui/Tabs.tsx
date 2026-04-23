"use client";

type TabsProps = {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`min-h-11 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition ${
            active === tab.id
              ? "bg-slate-950 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
