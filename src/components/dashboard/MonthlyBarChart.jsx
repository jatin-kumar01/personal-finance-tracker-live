import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MonthlyBarChart = ({ data = [] }) => {

  const chartData = data.map((item) => ({
    month:   item.month,
    income:  Number(item.income)  || 0,
    expense: Number(item.expense) || 0,
  }));

  const hasData = chartData.some((d) => d.income > 0 || d.expense > 0);
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No monthly data available.
      </div>
    );
  }

  return (

    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

          {/* dataKey="month" matches the sanitized property name exactly */}
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />

          <YAxis
            domain={[0, 'auto']}
            tickFormatter={(v) =>
              `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
            }
            tick={{ fontSize: 12 }}
            width={60}
          />

          <Tooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
            formatter={(value, name) => [
              `₹${Number(value).toLocaleString('en-IN')}`,
              name,
            ]}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />

          <Legend verticalAlign="bottom" height={36} />

          <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[4, 4, 0, 0]} />
          <Bar dataKey="income"  fill="#10B981" name="Income"  radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;

