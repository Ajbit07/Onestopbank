import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../lib/http';
import Wordmark from './Wordmark';

const links = [
  { to: '/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
  { to: '/account/deposit', icon: 'fa-money-bill-wave', label: 'Deposit' },
  { to: '/account/withdraw', icon: 'fa-money-bill', label: 'Withdraw' },
  { to: '/account/fund-transfer', icon: 'fa-exchange-alt', label: 'Fund Transfer' },
  { to: '/account/pin', icon: 'fa-key', label: 'Account PIN' },
  { to: '/user/profile', icon: 'fa-user', label: 'Profile' },
  { to: '/account/transaction-history', icon: 'fa-history', label: 'Transactions' },
];

export default function Sidebar() {
  const [visible, setVisible] = useState(window.innerWidth >= 768);

  if (!isLoggedIn()) return null;

  return (
    <motion.aside
      className="min-h-screen bg-pine-deep text-linen flex flex-col border-r border-black/20"
      initial={false}
      animate={{ width: visible ? 232 : 64 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div
        className={`flex items-center py-4 px-3 ${
          visible ? 'justify-between' : 'justify-center'
        }`}
      >
        {visible && <Wordmark light />}
        <button
          type="button"
          title="Toggle Sidebar"
          onClick={() => setVisible((v) => !v)}
          className="text-linen/60 hover:text-linen w-8 h-8 rounded-md hover:bg-white/10 transition-colors"
        >
          <i className="fas fa-bars text-sm"></i>
        </button>
      </div>

      {visible && (
        <p className="px-5 mt-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-linen/40">
          Banking
        </p>
      )}

      <nav className="px-2.5 flex-1">
        <ul>
          {links.map((link) => (
            <li className="mb-1" key={link.to}>
              <NavLink
                to={link.to}
                title={link.label}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                    visible ? '' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-white/10 text-linen'
                      : 'text-linen/60 hover:text-linen hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-yellow-400"></span>
                    )}
                    <i className={`fas ${link.icon} text-[13px] w-4 text-center`}></i>
                    {visible && (
                      <span className="whitespace-nowrap">{link.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {visible && (
        <p className="px-5 py-4 text-[11px] text-linen/30">
          &copy; 2025 OneStop Bank
        </p>
      )}
    </motion.aside>
  );
}
