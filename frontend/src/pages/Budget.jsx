import { useState, useEffect, useMemo } from 'react';
import { Target, Plus, Trash2, AlertTriangle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { getTransactions } from '../api/transactionApi';

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v ?? 0);

const STORAGE_KEY = 'finance_budgets';


const CURRENT_MONTH_PREFIX = new Date().toISOString().substring(0, 7);


function calculateCategorySpent(transactions, categoryName) {
  if (!transactions || transactions.length === 0) return 0;
  return transactions
    .filter((tx) => {
      const isExpense      = tx.type === 'EXPENSE';
      const matchCategory  = tx.category?.trim().toLowerCase() === categoryName?.trim().toLowerCase();
      const isCurrentMonth = tx.transactionDate?.startsWith(CURRENT_MONTH_PREFIX);
      return isExpense && matchCategory && isCurrentMonth;
    })
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

export default function Budget() {
  const [budgets, setBudgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  });
  const [transactions, setTransactions] = useState([]);
  const [newCat, setNewCat]   = useState('');
  const [newLimit, setNewLimit] = useState('');


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  }, [budgets]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions({ size: 1000 });
        // Backend may return a Page object ({ content: [...] }) or a plain array
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? [];
        setTransactions(list);
      } catch { /* silent — budget cards will show ₹0 if fetch fails */ }
    };
    fetchTransactions();
  }, []);

  const addBudget = () => {
    if (!newCat.trim() || !newLimit || Number(newLimit) <= 0) return;
    setBudgets((prev) => [
      ...prev.filter((b) => b.category.toLowerCase() !== newCat.trim().toLowerCase()),
      { category: newCat.trim(), limit: Number(newLimit) },
    ]);
    setNewCat('');
    setNewLimit('');
  };

  const removeBudget = (cat) =>
    setBudgets((prev) => prev.filter((b) => b.category !== cat));


  const spentMap = useMemo(() => {
    const map = {};
    budgets.forEach((b) => {
      map[b.category] = calculateCategorySpent(transactions, b.category);
    });
    return map;
  }, [transactions, budgets]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budget Goals</h1>
        <p className="text-sm text-gray-400">Set monthly spending limits per category (stored locally)</p>
      </div>

      {/* Add budget */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Plus size={15} /> Add Budget Goal
        </h3>
        <div className="flex gap-3 flex-wrap">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Category (e.g. Food)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[150px] focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            type="number"
            min="1"
            placeholder="Monthly limit (₹)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={addBudget}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add Goal
          </button>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Target size={40} className="mb-3 opacity-40" />
          <p className="font-medium">No budget goals set</p>
          <p className="text-sm">Add a category limit above to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const spent = spentMap[b.category] ?? 0;
            const pct   = Math.min((spent / b.limit) * 100, 100);
            const over  = spent > b.limit;
            return (
              <div key={b.category} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {over && <AlertTriangle size={15} className="text-rose-500" />}
                    <span className="font-semibold text-gray-800">{b.category}</span>
                  </div>
                  <button
                    onClick={() => removeBudget(b.category)}
                    className="text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>
                    Spent:{' '}
                    <span className={over ? 'text-rose-500 font-semibold' : 'text-gray-700 font-semibold'}>
                      {formatINR(spent)}
                    </span>
                  </span>
                  <span>
                    Limit: <span className="text-gray-700 font-semibold">{formatINR(b.limit)}</span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      over ? 'bg-rose-500' : pct > 75 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-400 mt-1">{pct.toFixed(0)}% used</p>
              </div>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
