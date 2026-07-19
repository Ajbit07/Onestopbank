import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import OtpInput from '../components/OtpInput';
import { useLoader } from '../context/LoaderContext';
import { generateOTP, verifyOTP } from '../services/auth';
import { errorMessage } from '../lib/http';
import { environment } from '../environment';

export default function Otp() {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [otpGenerated, setOtpGenerated] = useState(false);
  const navigate = useNavigate();
  const loader = useLoader();

  useEffect(() => {
    // Restore account number on page refresh
    const stored = sessionStorage.getItem('accountNumber');
    if (stored) {
      setIdentifier(stored);
      setOtpGenerated(true);
    }
  }, []);

  const handleGenerateOtp = async () => {
    if (!identifier) return;
    loader.show('Generating OTP...');
    try {
      const { data } = await generateOTP(identifier);
      toast.success((data.message || 'OTP sent') + ', Check Email');
      setOtpGenerated(true);
      sessionStorage.setItem('accountNumber', identifier);
    } catch (error) {
      toast.error(errorMessage(error));
      console.error(error);
    } finally {
      loader.hide();
    }
  };

  const handleVerifyOtp = async () => {
    loader.show('Verifying OTP...');
    try {
      const { data } = await verifyOTP({ identifier, otp });
      toast.success('Account LoggedIn');
      localStorage.setItem(environment.tokenName, data.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error(errorMessage(error));
      console.error(error);
    } finally {
      loader.hide();
    }
  };

  return (
    <PageTransition className="flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto panel p-8">
        <p className="kicker mb-1.5">One-time code</p>
        <h2 className="font-display font-semibold text-2xl text-ink mb-7">
          {!otpGenerated ? 'Sign in without a password' : 'Check your inbox'}
        </h2>

        {!otpGenerated ? (
          <>
            <div className="mb-6">
              <label htmlFor="identifier" className="label">
                Account number or email
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="We'll email a 6-digit code"
                className="field"
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={!identifier}
              className="btn-primary w-full"
            >
              Email me a code
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-stone-600 mb-5 leading-relaxed">
              We sent a 6-digit code to the email on file for{' '}
              <span className="font-semibold text-ink">{identifier}</span>.
            </p>
            <div className="mb-6">
              <OtpInput length={6} onChange={setOtp} />
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className="btn-primary w-full"
            >
              Verify &amp; sign in
            </button>
            <button
              type="button"
              onClick={handleGenerateOtp}
              className="w-full mt-4 text-center link text-[13px]"
            >
              Didn't get it? Send again
            </button>
          </>
        )}

        <p className="text-center text-sm text-stone-500 mt-6">
          Rather type a password?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
