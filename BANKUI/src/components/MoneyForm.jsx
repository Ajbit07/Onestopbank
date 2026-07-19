import { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from './PageTransition';

/**
 * Shared form for Deposit / Withdraw / Fund Transfer.
 * Fields: amount, 4-digit PIN, and optionally targetAccountNumber.
 */
export default function MoneyForm({
  title,
  subtitle,
  icon,
  buttonLabel,
  withTarget = false,
  onSubmit,
}) {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');

  const amountValid = amount !== '' && Number(amount) >= 0;
  const pinValid = /^\d{4}$/.test(pin);
  const targetValid = !withTarget || targetAccountNumber !== '';
  const isValid = amountValid && pinValid && targetValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const reset = () => {
      setAmount('');
      setPin('');
      setTargetAccountNumber('');
    };
    if (withTarget) {
      await onSubmit({ amount, pin, targetAccountNumber }, reset);
    } else {
      await onSubmit({ amount, pin }, reset);
    }
  };

  return (
    <PageTransition className="flex items-start justify-center py-10">
      <motion.div className="w-full max-w-md mx-auto panel p-8">
        <div className="flex items-start justify-between mb-7">
          <div>
            <p className="kicker mb-1.5">Money</p>
            <h2 className="font-display font-semibold text-2xl text-ink">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-stone-500 mt-1">{subtitle}</p>
            )}
          </div>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-pine-soft text-pine shrink-0">
            <i className={`fas ${icon}`}></i>
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {withTarget && (
            <div className="mb-4">
              <label htmlFor="targetAccountNumber" className="label">
                Target account number
              </label>
              <input
                id="targetAccountNumber"
                type="text"
                value={targetAccountNumber}
                onChange={(e) => setTargetAccountNumber(e.target.value)}
                placeholder="Recipient's account number"
                className="field tnum"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="amount" className="label">
              Amount (&#8377;)
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="field tnum"
              required
            />
          </div>

          <div className="mb-7">
            <label htmlFor="pin" className="label">
              Transaction PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="&bull;&bull;&bull;&bull;"
              className="field tnum tracking-[0.4em]"
              required
            />
            {pin && !pinValid && (
              <p className="text-clay text-xs mt-1.5">PIN must be 4 digits</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!isValid}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full"
          >
            {buttonLabel}
          </motion.button>
        </form>
      </motion.div>
    </PageTransition>
  );
}
