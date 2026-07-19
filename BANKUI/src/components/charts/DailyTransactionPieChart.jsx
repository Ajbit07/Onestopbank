import { useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { getAccountNumberFromToken } from '../../lib/http';
import { CHART_COLORS } from './chartSetup';

function todayString() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export default function DailyTransactionPieChart({ transactions }) {
  const [selectedDate, setSelectedDate] = useState(todayString());

  const data = useMemo(() => {
    const accountNumber = getAccountNumberFromToken();
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    const dayTransactions = transactions.filter((t) => {
      const d = new Date(t.transactionDate);
      d.setHours(0, 0, 0, 0);
      return selected.getTime() === d.getTime();
    });

    const typeData = { Deposit: 0, Withdrawal: 0, Transfer: 0, Credit: 0 };

    dayTransactions.forEach((t) => {
      let type = t.transactionType.slice(5);
      type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      if (type === 'Transfer' && t.targetAccountNumber === accountNumber) {
        typeData.Credit += t.amount;
      } else {
        typeData[type] += t.amount;
      }
    });

    return {
      labels: Object.keys(typeData),
      datasets: [
        {
          data: Object.values(typeData),
          backgroundColor: [
            CHART_COLORS.deposit,
            CHART_COLORS.withdrawal,
            CHART_COLORS.transfer,
            CHART_COLORS.credit,
          ],
        },
      ],
    };
  }, [transactions, selectedDate]);

  const hasData = data.datasets[0].data.some((v) => v > 0);

  return (
    <motion.div
      className="panel p-5 h-full"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.16 }}
    >
      <div className="flex flex-wrap items-end justify-between mb-4 gap-3">
        <div>
          <p className="kicker mb-1">Breakdown</p>
          <h4 className="font-display font-semibold text-xl text-ink">
            One day, split up
          </h4>
        </div>
        <input
          type="date"
          title="Select Date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="field !w-auto text-sm py-2"
        />
      </div>
      {hasData ? (
        <div className="max-w-[300px] mx-auto">
          <Pie
            data={data}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: 'top' } },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-stone-500 py-12 text-sm">
          No transactions on this date.
        </p>
      )}
    </motion.div>
  );
}
