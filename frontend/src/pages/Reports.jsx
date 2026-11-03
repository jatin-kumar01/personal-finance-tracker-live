import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import { getMonthlySummary, getCategorySummary } from '../api/dashboardApi';

const formatINR = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v ?? 0);

const MONTHS = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function Reports() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthly, setMonthly] = useState(null);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  useEffect(() => {
    const fetchReportsData = async () => {
      setLoading(true);
      try {
        // We fetch with both month (1-indexed) and fallback checks
        const [mRes, incRes, expRes] = await Promise.all([
          getMonthlySummary(year, month),
          getCategorySummary('INCOME'),
          getCategorySummary('EXPENSE'),
        ]);

        const mData = mRes?.data?.data || mRes?.data || {};
        const incData = incRes?.data?.data || incRes?.data || [];
        const expData = expRes?.data?.data || expRes?.data || [];

        setMonthly(mData);
        setIncomeCategories(Array.isArray(incData) ? incData : []);
        setExpenseCategories(Array.isArray(expData) ? expData : []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, [year, month]);

  // Helper to dynamically pull numeric values out of category items
  const extractValue = (obj) => {
    if (!obj || typeof obj !== 'object') return 0;
    // Check all common DTO field names
    const keys = ['amount', 'value', 'total', 'totalAmount', 'sum', 'count'];
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        return Number(obj[key]) || 0;
      }
    }
    return 0;
  };

  const localIncome = incomeCategories.reduce((acc, cur) => acc + extractValue(cur), 0);
  const localExpense = expenseCategories.reduce((acc, cur) => acc + extractValue(cur), 0);

  // Read backend fields or fall back to category aggregation
  const apiIncome = Number(monthly?.totalIncome || monthly?.income || monthly?.total_income || 0);
  const apiExpense = Number(monthly?.totalExpense || monthly?.expense || monthly?.total_expense || 0);

  const totalIncome = apiIncome > 0 ? apiIncome : localIncome;
  const totalExpense = apiExpense > 0 ? apiExpense : localExpense;
  const netSavings = totalIncome - totalExpense;

  // CSV Export Utility
  const handleExportCSV = () => {
    const rows = [
      ['Financial Report', `${MONTHS[month]} ${year}`],
      [],
      ['Summary', 'Amount (INR)'],
      ['Total Income', totalIncome],
      ['Total Expense', totalExpense],
      ['Net Savings', netSavings],
      [],
      ['Category Breakdown', 'Type', 'Amount (INR)'],
      ...incomeCategories.map((c) => [c.name || c.category, 'INCOME', extractValue(c)]),
      ...expenseCategories.map((c) => [c.name || c.category, 'EXPENSE', extractValue(c)]),
    ];

    const csvContent =
        'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finance_Report_${MONTHS[month]}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
      <MainLayout>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <p className="text-sm text-gray-400">Detailed financial analysis and trends</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            >
              {MONTHS.slice(1).map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
              ))}
            </select>

            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            >
              {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
              ))}
            </select>

            <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors shadow-sm"
            >
              Export CSV
            </button>

            <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
            >
              Print / PDF
            </button>
          </div>
        </div>

        {/* Monthly Summary Cards */}
        {loading ? (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                  <div
                      key={i}
                      className="bg-white rounded-2xl p-5 h-24 animate-pulse bg-gray-100 border border-gray-100"
                  />
              ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Income</p>
                <p className="text-2xl font-bold text-emerald-600">{formatINR(totalIncome)}</p>
                <p className="text-xs text-gray-400">
                  {MONTHS[month]} {year}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Expense</p>
                <p className="text-2xl font-bold text-rose-500">{formatINR(totalExpense)}</p>
                <p className="text-xs text-gray-400">
                  {MONTHS[month]} {year}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Savings</p>
                <p
                    className={`text-2xl font-bold ${
                        netSavings >= 0 ? 'text-indigo-600' : 'text-rose-600'
                    }`}
                >
                  {formatINR(netSavings)}
                </p>
                <p className="text-xs text-gray-400">
                  {MONTHS[month]} {year}
                </p>
              </div>
            </div>
        )}

        {/* Pie Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Income Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Income by Category
            </h3>

            <ExpensePieChart
                data={incomeCategories}
                type="income"
            />
          </div>

          {/* Expense Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Expense by Category
            </h3>

            <ExpensePieChart
                data={expenseCategories}
                type="expense"
            />
          </div>
        </div>
      </MainLayout>
  );
}