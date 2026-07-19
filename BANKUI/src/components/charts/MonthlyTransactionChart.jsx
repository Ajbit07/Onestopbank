import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { getAccountNumberFromToken } from '../../lib/http';
import { CHART_COLORS } from './chartSetup';

export default function MonthlyTransactionChart({ transactions }) {
  const data = useMemo(() => {
    const accountNumber = getAccountNumberFromToken();
    const monthlyData = {};

    transactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      const monthYear = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          CASH_DEPOSIT: 0,
          CASH_WITHDRAWAL: 0,
          CASH_TRANSFER: 0,
          CASH_CREDIT: 0,
        };
      }
      if (
        t.transactionType === 'CASH_TRANSFER' &&
        t.targetAccountNumber === accountNumber
      ) {
        monthlyData[monthYear].CASH_CREDIT += t.amount;
      } else {
        monthlyData[monthYear][t.transactionType] += t.amount;
      }
    });

    const sortedMonthYears = Object.keys(monthlyData).sort();

    return {
      labels: sortedMonthYears,
      datasets: [
        {
          data: sortedMonthYears.map((m) => monthlyData[m].CASH_DEPOSIT),
          label: 'Deposit',
          backgroundColor: CHART_COLORS.deposit,
        },
        {
          data: sortedMonthYears.map((m) => monthlyData[m].CASH_WITHDRAWAL),
          label: 'Withdrawal',
          backgroundColor: CHART_COLORS.withdrawal,
        },
        {
          data: sortedMonthYears.map((m) => monthlyData[m].CASH_TRANSFER),
          label: 'Transfer',
          backgroundColor: CHART_COLORS.transfer,
        },
        {
          data: sortedMonthYears.map((m) => monthlyData[m].CASH_CREDIT),
          label: 'Credit',
          backgroundColor: CHART_COLORS.credit,
        },
      ],
    };
  }, [transactions]);

  return (
    <motion.div
      className="panel p-5 h-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
    >
      <p className="kicker mb-1">Activity</p>
      <h4 className="font-display font-semibold text-xl text-ink mb-4">
        Month by month
      </h4>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { display: true, position: 'top' } },
        }}
      />
    </motion.div>
  );
}
