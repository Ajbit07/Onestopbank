import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getTransactions } from '../services/api';
import { getAccountNumberFromToken } from '../lib/http';
import { formatDate, formatINR } from '../util/format';
import DownloadTransactions from './DownloadTransactions';
import TransactionLineChart from './charts/TransactionLineChart';
import MonthlyTransactionChart from './charts/MonthlyTransactionChart';
import DailyTransactionPieChart from './charts/DailyTransactionPieChart';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState('');
  const userAccountNumber = getAccountNumberFromToken();

  useEffect(() => {
    getTransactions()
      .then(({ data }) => setTransactions(data))
      .catch((error) =>
        console.error('Error fetching transaction history:', error)
      );
  }, []);

  const filtered = useMemo(() => {
    if (filterCriteria === 'Deposit') {
      return transactions.filter((t) => t.transactionType === 'CASH_DEPOSIT');
    }
    if (filterCriteria === 'Withdrawal') {
      return transactions.filter(
        (t) => t.transactionType === 'CASH_WITHDRAWAL'
      );
    }
    if (filterCriteria === 'Transfer') {
      return transactions.filter((t) => t.transactionType === 'CASH_TRANSFER');
    }
    return transactions;
  }, [transactions, filterCriteria]);

  const getTransactionStatus = (transaction) => {
    const status = transaction.transactionType.slice(5).toLowerCase();
    if (
      status === 'transfer' &&
      transaction.targetAccountNumber === userAccountNumber
    ) {
      return 'Credit';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isOutgoing = (transaction) => {
    const s = getTransactionStatus(transaction);
    return s === 'Withdrawal' || s === 'Transfer';
  };

  return (
    <div className="coverparentspace">
      {transactions.length !== 0 && (
        <div className="flex gap-5 flex-col">
          <TransactionLineChart transactions={transactions} />
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="w-full">
              <MonthlyTransactionChart transactions={transactions} />
            </div>
            <div className="w-full">
              <DailyTransactionPieChart transactions={transactions} />
            </div>
          </div>
        </div>
      )}

      <div className="panel my-5 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <p className="kicker mb-1">Ledger</p>
            <h4 className="font-display font-semibold text-xl text-ink">
              Transaction history
            </h4>
          </div>
          <div className="flex items-center">
            <select
              id="filterCriteria"
              title="Filter by transaction type"
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value)}
              className="field !w-auto pr-8 text-sm"
            >
              <option value="Deposit">Deposits</option>
              <option value="Withdrawal">Withdrawals</option>
              <option value="Transfer">Transfers/Credited</option>
              <option value="">All transactions</option>
            </select>
            <DownloadTransactions data={transactions} />
          </div>
        </div>

        {filtered.length !== 0 && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="text-[11px] font-semibold tracking-[0.1em] text-left text-stone-500 uppercase border-b-2 border-hairline">
                  <th className="px-3 py-2.5 font-semibold">ID</th>
                  <th className="px-3 py-2.5 font-semibold text-right">
                    Amount
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Date</th>
                  <th className="px-3 py-2.5 font-semibold">Type</th>
                  <th className="px-3 py-2.5 font-semibold">From</th>
                  <th className="px-3 py-2.5 font-semibold">To</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    className="text-ink border-b border-dashed border-hairline last:border-0 hover:bg-paper/60 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: Math.min(index * 0.025, 0.5),
                    }}
                  >
                    <td className="px-3 py-3 text-stone-500 tnum">
                      #{transaction.id}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-semibold tnum ${
                        isOutgoing(transaction) ? 'text-clay' : 'text-pine'
                      }`}
                    >
                      {isOutgoing(transaction) ? '−' : '+'}
                      {formatINR(transaction.amount)}
                    </td>
                    <td className="px-3 py-3 tnum text-stone-600">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`${getTransactionStatus(
                          transaction
                        )}-color inline-block px-2 py-0.5 text-xs font-semibold rounded`}
                      >
                        {getTransactionStatus(transaction)}
                      </span>
                    </td>
                    <td className="px-3 py-3 tnum text-stone-600">
                      {transaction.sourceAccountNumber}
                    </td>
                    <td className="px-3 py-3 tnum text-stone-600">
                      {transaction.targetAccountNumber || '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-receipt text-3xl text-hairline mb-3"></i>
            <p className="font-display font-semibold text-xl text-ink">
              Nothing here yet
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Transactions will appear here once you make one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
