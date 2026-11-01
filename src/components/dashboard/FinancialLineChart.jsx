import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
const buildChartData = (transactions = []) => {
  const now = new Date();


  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.push({ name: label, yearMonth, Income: 0, Savings: 0, _expense: 0 });
  }


  transactions.forEach((tx) => {
    if (!tx.transactionDate) return;

    const txYearMonth = String(tx.transactionDate).substring(0, 7);
    const bucket = buckets.find((b) => b.yearMonth === txYearMonth);
    if (!bucket) return;

    const amount = Number(tx.amount) || 0;
    if (tx.type === 'INCOME') {
      bucket.Income += amount;
    } else if (tx.type === 'EXPENSE') {
      bucket._expense += amount;
    }
    bucket.Savings = bucket.Income - bucket._expense;
  });


  return buckets.map(({ yearMonth: _ym, _expense: _e, ...rest }) => rest);
};

export default function FinancialLineChart({ transactions }) {
  const chartData = buildChartData(transactions);

  const hasData = chartData.some((d) => d.Income > 0 || d.Savings !== 0);
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No trend data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 12 }}
          width={60}
          domain={['auto', 'auto']}
        />
        <Tooltip formatter={(v, name) => [formatINR(v), name]} />
        <Legend />
        <Line type="monotone" dataKey="Income" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Savings" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
