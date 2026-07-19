import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAccountDetails } from '../services/api';
import { formatINR } from '../util/format';

export default function AccountDetailCard() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    getAccountDetails()
      .then(({ data }) => setAccount(data))
      .catch((error) => {
        toast.error('Error fetching account details');
        console.log('Error fetching account details:', error);
      });
  }, []);

  return (
    <motion.div
      className="relative h-full overflow-hidden rounded-lg bg-blue-500 text-white shadow-lg p-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
    >
      {/* quiet oversized watermark, like a passbook stamp */}
      <i className="fas fa-piggy-bank absolute -right-5 -bottom-7 text-[130px] text-white/[0.06] rotate-[-8deg]"></i>

      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
          Current balance
        </p>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
          {account?.accountType || ''}
        </span>
      </div>

      <motion.h2
        className="font-semibold text-4xl tnum mb-7 text-yellow-400"
        key={account?.balance}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {account ? formatINR(account.balance) : '—'}
      </motion.h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
        <div>
          <p className="text-white/70 mb-0.5">Account no.</p>
          <p className="font-semibold tnum tracking-wide">
            {account?.accountNumber}
          </p>
        </div>
        <div>
          <p className="text-white/70 mb-0.5">IFSC</p>
          <p className="font-semibold tracking-wide">{account?.ifscCode}</p>
        </div>
        <div className="col-span-2">
          <p className="text-white/70 mb-0.5">Branch</p>
          <p className="font-semibold">{account?.branch}</p>
        </div>
      </div>
    </motion.div>
  );
}
