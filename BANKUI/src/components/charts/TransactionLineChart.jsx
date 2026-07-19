import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { getAccountNumberFromToken } from '../../lib/http';
import { CHART_COLORS, MONTHS } from './chartSetup';

export default function TransactionLineChart({ transactions }) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          transactions.map((t) => new Date(t.transactionDate).getFullYear())
        )
      ),
    [transactions]
  );

  const data = useMemo(() => {
    const accountNumber = getAccountNumberFromToken();

    const filtered = transactions.filter((t) => {
      const d = new Date(t.transactionDate);
      return (
        d.getFullYear() === Number(selectedYear) &&
        MONTHS[d.getMonth()] === selectedMonth
      );
    });

    const grouped = filtered.reduce((acc, t) => {
      const d = new Date(t.transactionDate);
      const date = d.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date: d,
          amounts: {
            CASH_DEPOSIT: 0,
            CASH_WITHDRAWAL: 0,
            CASH_TRANSFER: 0,
            CASH_CREDIT: 0,
          },
        };
      }
      if (
        t.transactionType === 'CASH_TRANSFER' &&
        t.targetAccountNumber === accountNumber
      ) {
        acc[date].amounts.CASH_CREDIT += t.amount;
      } else {
        acc[date].amounts[t.transactionType] += t.amount;
      }
      return acc;
    }, {});

    const sorted = Object.values(grouped).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return {
      labels: sorted.map((g) =>
        g.date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      ),
      datasets: [
        {
          data: sorted.map((g) => g.amounts.CASH_DEPOSIT),
          label: 'Deposit',
          borderColor: CHART_COLORS.deposit,
          backgroundColor: CHART_COLORS.deposit,
          tension: 0.3,
        },
        {
          data: sorted.map((g) => g.amounts.CASH_WITHDRAWAL),
          label: 'Withdrawal',
          borderColor: CHART_COLORS.withdrawal,
          backgroundColor: CHART_COLORS.withdrawal,
          tension: 0.3,
        },
        {
          data: sorted.map((g) => g.amounts.CASH_TRANSFER),
          label: 'Fund Transfer',
          borderColor: CHART_COLORS.transfer,
          backgroundColor: CHART_COLORS.transfer,
          tension: 0.3,
        },
        {
          data: sorted.map((g) => g.amounts.CASH_CREDIT),
          label: 'Fund Credit',
          borderColor: CHART_COLORS.credit,
          backgroundColor: CHART_COLORS.credit,
          tension: 0.3,
        },
      ],
    };
  }, [transactions, selectedYear, selectedMonth]);

  return (
    <motion.div
      className="panel p-5"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-wrap items-end justify-between mb-4 gap-3">
        <div>
          <p className="kicker mb-1">Activity</p>
          <h4 className="font-display font-semibold text-xl text-ink">
            Day by day
          </h4>
        </div>
        <div className="flex gap-2">
          <select
            title="Select Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="field !w-auto text-sm py-2"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            title="Select Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="field !w-auto text-sm py-2"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[300px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top' } },
          }}
        />
      </div>
    </motion.div>
  );
}
