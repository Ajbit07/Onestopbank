import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useLoader } from '../context/LoaderContext';
import { checkPinCreated, createPin, updatePin } from '../services/api';
import { errorMessage } from '../lib/http';

export default function AccountPin() {
  const [loading, setLoading] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(true);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const loader = useLoader();

  useEffect(() => {
    checkPinCreated()
      .then(({ data }) => {
        if (typeof data === 'string') {
          setShowGenerateForm(data.includes('not been created'));
        } else if (data && data.hasPIN) {
          setShowGenerateForm(false);
        } else {
          setShowGenerateForm(true);
        }
      })
      .catch((error) => {
        console.error('Error checking PIN status:', error);
        setShowGenerateForm(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const pinValid = /^\d{4}$/.test(newPin);

  const onSubmitGenerate = async (e) => {
    e.preventDefault();
    if (!pinValid || newPin !== confirmPin || !password) return;
    loader.show('Generating PIN...');
    try {
      const { data } = await createPin(newPin, password);
      loader.hide();
      toast.success('PIN generated successfully');
      console.log('PIN generated successfully:', data);
      navigate('/dashboard');
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Failed to generate PIN'));
      console.error('Error generating PIN:', error);
    }
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(oldPin) || !pinValid || !password) return;
    loader.show('Updating PIN...');
    try {
      const { data } = await updatePin(oldPin, newPin, password);
      loader.hide();
      toast.success('PIN updated successfully');
      console.log('PIN updated successfully:', data);
      navigate('/dashboard');
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Failed to update PIN'));
      console.error('Error updating PIN:', error);
    }
  };

  if (loading) {
    return (
      <PageTransition className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-[3px] border-pine/20 border-t-pine rounded-full animate-spin" />
      </PageTransition>
    );
  }

  const pinInputProps = (value, setter) => ({
    type: 'password',
    inputMode: 'numeric',
    maxLength: 4,
    value,
    onChange: (e) => setter(e.target.value.replace(/\D/g, '')),
    className: 'field tnum tracking-[0.4em]',
  });

  return (
    <PageTransition className="flex items-start justify-center py-10">
      <motion.div
        className="w-full max-w-md mx-auto panel p-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-start justify-between mb-7">
          <div>
            <p className="kicker mb-1.5">Security</p>
            <h2 className="font-display font-semibold text-2xl text-ink">
              {showGenerateForm ? 'Set your PIN' : 'Change your PIN'}
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {showGenerateForm
                ? 'A 4-digit code that signs off every transaction.'
                : 'Swap the old code for a new one.'}
            </p>
          </div>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-pine-soft text-pine shrink-0">
            <i className="fas fa-key"></i>
          </span>
        </div>

        {showGenerateForm ? (
          <form onSubmit={onSubmitGenerate}>
            <div className="mb-4">
              <label className="label" htmlFor="newPin">
                New PIN
              </label>
              <input
                id="newPin"
                placeholder="&bull;&bull;&bull;&bull;"
                {...pinInputProps(newPin, setNewPin)}
              />
              {newPin && !pinValid && (
                <p className="text-clay text-xs mt-1.5">PIN must be 4 digits</p>
              )}
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="confirmPin">
                Confirm PIN
              </label>
              <input
                id="confirmPin"
                placeholder="&bull;&bull;&bull;&bull;"
                {...pinInputProps(confirmPin, setConfirmPin)}
              />
              {confirmPin && newPin !== confirmPin && (
                <p className="text-clay text-xs mt-1.5">PINs do not match</p>
              )}
            </div>
            <div className="mb-7">
              <label className="label" htmlFor="password">
                Account password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="To confirm it's really you"
                className="field"
              />
            </div>
            <button
              type="submit"
              disabled={!pinValid || newPin !== confirmPin || !password}
              className="btn-primary w-full"
            >
              Set PIN
            </button>
          </form>
        ) : (
          <form onSubmit={onSubmitChange}>
            <div className="mb-4">
              <label className="label" htmlFor="oldPin">
                Current PIN
              </label>
              <input
                id="oldPin"
                placeholder="&bull;&bull;&bull;&bull;"
                {...pinInputProps(oldPin, setOldPin)}
              />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="newPinChange">
                New PIN
              </label>
              <input
                id="newPinChange"
                placeholder="&bull;&bull;&bull;&bull;"
                {...pinInputProps(newPin, setNewPin)}
              />
              {newPin && !pinValid && (
                <p className="text-clay text-xs mt-1.5">PIN must be 4 digits</p>
              )}
            </div>
            <div className="mb-7">
              <label className="label" htmlFor="passwordChange">
                Account password
              </label>
              <input
                id="passwordChange"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="To confirm it's really you"
                className="field"
              />
            </div>
            <button
              type="submit"
              disabled={!/^\d{4}$/.test(oldPin) || !pinValid || !password}
              className="btn-primary w-full"
            >
              Update PIN
            </button>
          </form>
        )}
      </motion.div>
    </PageTransition>
  );
}
