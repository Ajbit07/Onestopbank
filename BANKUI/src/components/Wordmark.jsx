import { Link } from 'react-router-dom';

/** The bank wordmark — serif type with a small mark, used in header & sidebar. */
export default function Wordmark({ to = '/', light = false, compact = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-baseline gap-2 cursor-pointer group ${
        light ? 'text-linen' : 'text-ink'
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-md self-center ${
          light ? 'bg-white/15 text-white' : 'bg-pine-soft text-pine'
        }`}
      >
        <i className="fas fa-piggy-bank text-sm"></i>
      </span>
      {!compact && (
        <span className="font-display font-semibold text-xl tracking-tight whitespace-nowrap">
          OneStop&nbsp;Bank
          <span className={light ? 'text-yellow-400' : 'text-pine'}>.</span>
        </span>
      )}
    </Link>
  );
}
