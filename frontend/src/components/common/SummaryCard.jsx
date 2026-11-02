export default function SummaryCard({ title, value, icon: Icon, color, subtitle }) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ring-2 ${colorMap[color] || colorMap.indigo}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
