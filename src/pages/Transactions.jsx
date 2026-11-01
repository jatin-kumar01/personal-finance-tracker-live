import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Modal from '../components/common/Modal';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionTable from '../components/transactions/TransactionTable';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactionApi';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
  const [search, setSearch] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const { data } = await getTransactions(params);
      setTransactions(data);
    } catch {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await updateTransaction(editTarget.id, formData);
      } else {
        await createTransaction(formData);
      }
      setModalOpen(false);
      setEditTarget(null);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (tx) => { setEditTarget(tx); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? This action cannot be undone.')) return;
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch { setError('Failed to delete transaction.'); }
  };

  const handleOpenAdd = () => { setEditTarget(null); setModalOpen(true); };

  const clearFilters = () => setFilters({ type: '', category: '', startDate: '', endDate: '' });
  const hasFilters = Object.values(filters).some(Boolean);

  const filtered = search
    ? transactions.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    : transactions;

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-400">Manage and filter your financial records</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X size={14} /></button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600">
          <SlidersHorizontal size={15} /> Filters
          {hasFilters && <button onClick={clearFilters} className="text-rose-400 hover:text-rose-600 text-xs ml-auto">Clear all</button>}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">All Types</option>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
          <input value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} placeholder="Category..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <input type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <input type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or category..." className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="text-xs text-gray-400 mb-4">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
        <TransactionTable transactions={filtered} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm onSubmit={handleSubmit} initialData={editTarget} loading={formLoading} />
      </Modal>
    </MainLayout>
  );
}
