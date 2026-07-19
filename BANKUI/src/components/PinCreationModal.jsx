import { motion } from 'framer-motion';

export default function PinCreationModal({ onRedirect }) {
  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center bg-ink/40 backdrop-blur-[2px] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="panel max-w-sm w-full p-7 text-center"
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
      >
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-pine-soft text-pine mb-4">
          <i className="fas fa-key"></i>
        </span>
        <p className="font-display font-semibold text-xl text-ink mb-1.5">
          One more step
        </p>
        <p className="text-sm text-stone-600 leading-relaxed mb-5">
          You haven't set a transaction PIN yet. It takes a minute, and you'll
          need it for deposits, withdrawals and transfers.
        </p>
        <button type="button" onClick={onRedirect} className="btn-primary w-full">
          Create my PIN
        </button>
      </motion.div>
    </motion.div>
  );
}
