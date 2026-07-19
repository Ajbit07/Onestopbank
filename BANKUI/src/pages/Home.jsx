import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { isLoggedIn } from '../lib/http';

const features = [
  {
    no: '01',
    title: 'Secure transactions',
    text: 'Every transaction is protected with current encryption standards, a transaction PIN, and JWT-backed sessions.',
  },
  {
    no: '02',
    title: 'Easy fund management',
    text: 'Deposit, withdraw and transfer in a couple of clicks — no forms that feel like paperwork.',
  },
  {
    no: '03',
    title: 'Multi-user support',
    text: 'Built to hold up with many accounts at once, which makes it a fit for families and small businesses.',
  },
  {
    no: '04',
    title: 'A ledger you can read',
    text: 'Full transaction history with charts, filters, and a one-click Excel statement.',
  },
];

export default function Home() {
  const loggedIn = isLoggedIn();

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="kicker mb-4">OneStop Bank</p>
            <h1 className="font-display font-semibold text-ink text-4xl sm:text-5xl md:text-[56px] leading-[1.08] mb-5">
              Banking that
              <br />
              stays{' '}
              <span className="hand-underline">
                out of your way
                <svg viewBox="0 0 220 12" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M3 9 C 40 3, 90 2, 130 6 S 200 10, 217 5"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-md">
              Your one-stop solution for everyday banking needs — deposits,
              transfers, and a clear view of where your money went.
            </p>
            <div className="flex items-center gap-4">
              {!loggedIn ? (
                <>
                  <Link to="/register" className="btn-primary !px-6 !py-3">
                    Open an account
                  </Link>
                  <Link to="/login" className="link text-sm">
                    I already have one
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary !px-6 !py-3">
                  Go to dashboard
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            {/* framed screenshot, like a window */}
            <div className="rounded-lg border border-hairline bg-white shadow-[0_24px_60px_-30px_rgba(32,40,31,0.35)] overflow-hidden rotate-[0.4deg]">
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-hairline bg-paper">
                <span className="w-2.5 h-2.5 rounded-full bg-clay/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-gold/70"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-pine/70"></span>
              </div>
              <img
                src="/assets/dashboard.png"
                alt="A look at the OneStop Bank dashboard"
                className="w-full block"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features — numbered, editorial */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <p className="kicker mb-2">Why people stay</p>
          <h2 className="font-display font-semibold text-2xl text-ink mb-8">
            The boring parts, done properly.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.no}
                className="pt-4 border-t-2 border-ink/80"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
              >
                <p className="tnum text-[13px] font-semibold text-pine mb-2">
                  {f.no}
                </p>
                <h4 className="font-display font-semibold text-lg text-ink mb-2">
                  {f.title}
                </h4>
                <p className="text-[14px] text-stone-600 leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-linen/80 py-10 mt-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-semibold text-linen text-lg">
              OneStop&nbsp;Bank<span className="text-yellow-400">.</span>
            </p>
            <p className="text-sm text-linen/50 mt-1">
              &copy; 2025 OneStopBank. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}
