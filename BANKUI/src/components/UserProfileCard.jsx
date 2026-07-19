import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserDetails } from '../services/auth';

export default function UserProfileCard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserDetails()
      .then(({ data }) => setProfile(data))
      .catch((error) =>
        console.error('Error fetching user profile data:', error)
      );
  }, []);

  const initial = profile?.name?.trim()?.[0]?.toUpperCase() || '·';

  return (
    <motion.div
      className="h-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg p-6"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-4 mb-5">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white font-semibold text-xl">
          {initial}
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Account holder
          </p>
          <h2 className="font-semibold text-[22px] leading-tight">
            {profile?.name || '—'}
          </h2>
        </div>
      </div>

      <dl className="space-y-3 text-[14px]">
        <div className="flex items-baseline gap-3">
          <dt className="w-16 shrink-0 text-white/70">Phone</dt>
          <dd className="font-medium tnum">{profile?.phoneNumber}</dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-16 shrink-0 text-white/70">Email</dt>
          <dd className="font-medium break-all">{profile?.email}</dd>
        </div>
        <div className="flex items-baseline gap-3">
          <dt className="w-16 shrink-0 text-white/70">Address</dt>
          <dd className="font-medium">{profile?.address}</dd>
        </div>
      </dl>
    </motion.div>
  );
}
