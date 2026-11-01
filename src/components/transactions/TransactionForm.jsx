import { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Salary', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Healthcare', 'Shopping', 'Investment', 'Other'];

const initialState = {
  title: '', amount: '', type: 'EXPENSE', category: 'Food', description: '', transactionDate: '',
};

export default function TransactionForm({ onSubmit, initialData, loading }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        type: initialData.type || 'EXPENSE',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        transactionDate: initialData.transactionDate || '',
      });
    } else {
      setForm(initialState);
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid positive amount';
    if (!form.transactionDate) e.transactionDate = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  const inputCls = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${errors[field] ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Monthly Salary" className={inputCls('title')} />
        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Amount + Type */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹) *</label>
          <input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" className={inputCls('amount')} />
          {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputCls('type')}>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </div>
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
          <input name="transactionDate" type="date" value={form.transactionDate} onChange={handleChange} className={inputCls('transactionDate')} />
          {errors.transactionDate && <p className="text-rose-500 text-xs mt-1">{errors.transactionDate}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Optional note..." className={`${inputCls('description')} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
      >
        {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
}
