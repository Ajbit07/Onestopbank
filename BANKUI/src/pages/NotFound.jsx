import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition className="flex items-center justify-center py-24">
      <div className="text-center max-w-sm">
        <motion.p
          className="font-display font-semibold text-[90px] leading-none text-pine"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          404
        </motion.p>
        <div className="w-16 h-[3px] bg-yellow-400 mx-auto my-5 rounded-full rotate-[-1.5deg]"></div>
        <p className="font-display font-semibold text-xl text-ink">
          This page isn't on the ledger.
        </p>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
          The address may have been mistyped, or the page has moved somewhere
          quieter.
        </p>
        <Link to="/" className="btn-primary mt-7">
          Back to the front desk
        </Link>
      </div>
    </PageTransition>
  );
}
