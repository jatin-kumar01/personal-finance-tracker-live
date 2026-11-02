import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SummaryCard from '../components/common/SummaryCard';
import ExpensePieChart from '../components/dashboard/ExpensePieChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import FinancialLineChart from '../components/dashboard/FinancialLineChart';
import { getOverallSummary, getCategorySummary } from '../api/dashboardApi';
import { getTransactions } from '../api/transactionApi';

const formatINR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v ?? 0);


function buildMonthlyChartData(transactions = []) {
  const now = new Date();
  const bucketMap = new Map();
  const orderedKeys = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString('default', { month: 'short' });
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    bucketMap.set(key, { month, income: 0, expense: 0 });
    orderedKeys.push(key);
  }

  transactions.forEach((tx) => {
    if (!tx.transactionDate) return;
    const key    = String(tx.transactionDate).substring(0, 7);
    const bucket = bucketMap.get(key);
    if (!bucket) return;
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'INCOME')   bucket.income  += amount;
    if (tx.type === 'EXPENSE')  bucket.expense += amount;
  });

  return orderedKeys.map((key) => bucketMap.get(key));
}

export default function Dashboard() {
  const [summary, setSummary]         = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [s, cat, txRes] = await Promise.all([
          getOverallSummary(),
          getCategorySummary('EXPENSE'),
          getTransactions({ size: 1000 }),
        ]);
        setSummary(s.data);
        setCategoryData(cat.data);
        const txList = Array.isArray(txRes.data)
          ? txRes.data
          : txRes.data?.content ?? [];
        setTransactions(txList);
      } catch {
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const barChartData = useMemo(() => buildMonthlyChartData(transactions), [transactions]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400">Your financial overview at a glance</p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>}

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <SummaryCard title="Net Balance"   value={formatINR(summary?.netBalance)}     icon={Wallet}      color="indigo" />
          <SummaryCard title="Total Income"  value={formatINR(summary?.totalIncome)}    icon={TrendingUp}  color="emerald" />
          <SummaryCard title="Total Expense" value={formatINR(summary?.totalExpense)}   icon={TrendingDown} color="rose" />
          <SummaryCard title="Transactions"  value={summary?.totalTransactions ?? 0}    icon={Activity}    color="amber" subtitle="all time" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Expense Breakdown by Category</h3>
          <ExpensePieChart data={categoryData} />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Income vs Expense</h3>
          {/* data= receives pre-aggregated { month, income, expense }[] — no stray keys */}
          <MonthlyBarChart data={barChartData} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Income &amp; Savings Trend (Last 6 Months)</h3>
        <FinancialLineChart transactions={transactions} />
      </div>
    </MainLayout>
  );
}
