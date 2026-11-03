
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Green shades for income
const INCOME_COLORS = [
  '#16a34a',
  '#22c55e',
  '#15803d',
  '#4ade80',
  '#86efac',
  '#10b981',
  '#059669',
  '#34d399',
];

// Different colors for expenses
const EXPENSE_COLORS = [
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#64748b',
  '#d946ef',
];

const formatINR = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

// Outside label
const renderLabel = ({
                       cx,
                       cy,
                       midAngle,
                       outerRadius,
                       name,
                       percent,
                       fill,
                     }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;

  const x =
      cx + radius * Math.cos(-midAngle * RADIAN);

  const y =
      cy + radius * Math.sin(-midAngle * RADIAN);

  return (
      <text
          x={x}
          y={y}
          fill={fill}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
          fontSize={11}
          fontWeight={500}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
  );
};

// Bottom legend
const CustomLegend = ({ payload = [] }) => (
    <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-3 px-4 py-4">
      {payload.map((item, index) => (
          <div
              key={`${item.value}-${index}`}
              className="flex items-center gap-2 text-xs text-gray-600"
          >
        <span
            className="w-3 h-3 rounded-sm shrink-0"
            style={{ backgroundColor: item.color }}
        />
            <span>{item.value}</span>
          </div>
      ))}
    </div>
);

export default function ExpensePieChart({
                                          data = [],
                                          type = 'expense',
                                        }) {
  const isIncome = type === 'income';

  const COLORS = isIncome
      ? INCOME_COLORS
      : EXPENSE_COLORS;

  // One slice for every transaction
  const chartData = data
      .map((item, index) => ({
        name:
            item.category ||
            item.title ||
            item.description ||
            `Transaction ${index + 1}`,

        value: Math.abs(
            Number(
                item.amount ??
                item.totalAmount ??
                0
            )
        ),
      }))
      .filter((item) =>
          Number.isFinite(item.value) && item.value > 0
      );

  if (chartData.length === 0) {
    return (
        <div className="flex items-center justify-center h-72 text-gray-400">
          No {type} data available.
        </div>
    );
  }

  return (
      <div className="w-full bg-white rounded-xl p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          {isIncome
              ? 'Income by Category'
              : 'Expense by Category'}
        </h3>

        <ResponsiveContainer width="100%" height={420}>
          <PieChart margin={{ top: 35, right: 55, bottom: 10, left: 55 }}>
            <Pie
                data={chartData}
                cx="50%"
                cy="44%"
                outerRadius={115}
                dataKey="value"
                nameKey="name"
                label={renderLabel}
                labelLine={{
                  stroke: '#94a3b8',
                  strokeWidth: 1,
                }}
                isAnimationActive={true}
            >
              {chartData.map((item, index) => (
                  <Cell
                      key={`${item.name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                  />
              ))}
            </Pie>

            <Tooltip
                formatter={(value) => formatINR(value)}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                }}
            />

            <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
  );
}
