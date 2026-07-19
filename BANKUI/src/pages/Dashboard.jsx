import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import UserProfileCard from '../components/UserProfileCard';
import AccountDetailCard from '../components/AccountDetailCard';
import PinCreationModal from '../components/PinCreationModal';
import TransactionHistory from '../components/TransactionHistory';
import { checkPinCreated } from '../services/api';

export default function Dashboard() {
  const [showPinModal, setShowPinModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkPinCreated()
      .then(({ data }) => {
        if (data && data.hasPIN === false) {
          setShowPinModal(true);
        }
      })
      .catch((error) => console.error('Error checking PIN status:', error));
  }, []);

  const redirectToPinCreation = () => {
    setShowPinModal(false);
    navigate('/account/pin');
  };

  return (
    <PageTransition className="px-1 md:px-3 py-3">
      <div className="mb-5">
        <p className="kicker mb-1">Overview</p>
        <h1 className="font-display font-semibold text-[26px] text-ink">
          Your money at a glance
        </h1>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 items-stretch">
        <UserProfileCard />
        <AccountDetailCard />
      </div>

      <TransactionHistory />

      <AnimatePresence>
        {showPinModal && <PinCreationModal onRedirect={redirectToPinCreation} />}
      </AnimatePresence>
    </PageTransition>
  );
}
