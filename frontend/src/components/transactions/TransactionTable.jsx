import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const formatINR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v);

export default function TransactionTable({ transactions, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mr-3" />
        Loading transactions...
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <ArrowDownCircle size={40} className="mb-3 opacity-40" />
        <p className="font-medium">No transactions found</p>
        <p className="text-sm">Add your first transaction using the button above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase tracking-wide">
            <th className="pb-3 pr-4 font-semibold">Title</th>
            <th className="pb-3 pr-4 font-semibold">Category</th>
            <th className="pb-3 pr-4 font-semibold">Type</th>
            <th className="pb-3 pr-4 font-semibold">Date</th>
            <th className="pb-3 pr-4 font-semibold text-right">Amount</th>
            <th className="pb-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">{tx.title}</p>
                {tx.description && <p className="text-xs text-gray-400 truncate max-w-[180px]">{tx.description}</p>}
              </td>
              <td className="py-3 pr-4">
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                  {tx.category}
                </span>
              </td>
              <td className="py-3 pr-4">
                {tx.type === 'INCOME' ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ArrowUpCircle size={14} /> INCOME
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-500 font-medium">
                    <ArrowDownCircle size={14} /> EXPENSE
                  </span>
                )}
              </td>
              <td className="py-3 pr-4 text-gray-500">{tx.transactionDate}</td>
              <td className={`py-3 pr-4 text-right font-semibold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatINR(tx.amount)}
              </td>
              <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(tx)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onDelete(tx.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
