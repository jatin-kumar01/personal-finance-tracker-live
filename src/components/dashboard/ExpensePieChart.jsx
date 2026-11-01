import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#f43f5e', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const formatINR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

export default function ExpensePieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No category data available.
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.category, value: Number(d.totalAmount) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" outerRadius={95} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => formatINR(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
