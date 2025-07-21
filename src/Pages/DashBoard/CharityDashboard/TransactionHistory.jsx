import React, { useEffect, useState } from 'react';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosSecure.get('transactions', {
          params: { email: user?.email },
        });
        setTransactions(res.data.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchTransactions();
    }
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <p className="text-center py-8">Loading transaction history...</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-center py-8">No transactions found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-100">
            <tr className="text-sm text-gray-600">
              <th>#</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Request Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={txn._id}>
                <th>{index + 1}</th>
                <td className="text-blue-600 break-all">{txn.transactionId}</td>
                <td>${txn.amount}</td>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      txn.approval_status === 'approved'
                        ? 'badge-success'
                        : txn.approval_status === 'rejected'
                        ? 'badge-error'
                        : 'badge-warning'
                    }`}
                  >
                    {txn.approval_status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
