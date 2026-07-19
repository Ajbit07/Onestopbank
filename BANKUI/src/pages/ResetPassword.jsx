import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import OtpInput from '../components/OtpInput';
import { useLoader } from '../context/LoaderContext';
import {
  resetPassword,
  sendOtpForPasswordReset,
  verifyOtpForPasswordReset,
} from '../services/auth';
import { errorMessage } from '../lib/http';
import { identifierRegx, StrongPasswordRegx } from '../util/formutil';

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const loader = useLoader();

  const identifierValid = identifierRegx.test(identifier);
  const passwordValid = StrongPasswordRegx.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const sendOtp = async () => {
    if (!identifierValid) return;
    loader.show('Generating OTP...');
    try {
      const { data } = await sendOtpForPasswordReset(identifier);
      toast.success(data.message || 'OTP sent');
      setOtpSent(true);
    } catch (error) {
      toast.error('Failed to send OTP: ' + errorMessage(error));
      console.error('Failed to send OTP:', error);
    } finally {
      loader.hide();
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;
    loader.show('Verifying OTP...');
    try {
      const { data } = await verifyOtpForPasswordReset(identifier, otp);
      toast.success('OTP Verified');
      setShowNewPasswordForm(true);
      setResetToken(data.passwordResetToken);
    } catch (error) {
      toast.error('Error verifying OTP : ' + errorMessage(error));
      console.error('Error verifying OTP:', error);
    } finally {
      loader.hide();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch) return;
    loader.show('Setting new Password...');
    try {
      await resetPassword(identifier, resetToken, newPassword);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error resetting password ' + errorMessage(error));
      console.error('Error resetting password:', error);
    } finally {
      loader.hide();
    }
  };

  return (
    <PageTransition className="flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto panel p-8">
        <p className="kicker mb-1.5">Happens to everyone</p>
        <h2 className="font-display font-semibold text-2xl text-ink mb-7">
          Reset your password
        </h2>

        {!showNewPasswordForm ? (
          <>
            <div className="mb-5">
              <label htmlFor="identifier" className="label">
                Account number or email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={otpSent}
                placeholder="Where should we send the code?"
                className="field"
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                onClick={sendOtp}
                disabled={!identifierValid}
                className="btn-primary w-full"
              >
                Send code
              </button>
            ) : (
              <>
                <p className="text-sm text-stone-600 mb-4">
                  Enter the 6-digit code we emailed you.
                </p>
                <div className="mb-6">
                  <OtpInput length={6} onChange={setOtp} />
                </div>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otp.length !== 6}
                  className="btn-primary w-full"
                >
                  Verify code
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full mt-4 text-center link text-[13px]"
                >
                  Send a new code
                </button>
              </>
            )}
          </>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="label">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8+ characters, mixed case, a number"
                className="field"
              />
              {newPassword && !passwordValid && (
                <p className="text-clay text-xs mt-1.5">
                  Min 8 chars with uppercase, lowercase and a digit
                </p>
              )}
            </div>
            <div className="mb-7">
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Same one again"
                className="field"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-clay text-xs mt-1.5">
                  Passwords do not match
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!passwordValid || !passwordsMatch}
              className="btn-primary w-full"
            >
              Set new password
            </button>
          </form>
        )}

        <p className="text-center text-sm text-stone-500 mt-6">
          Remembered it after all?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
