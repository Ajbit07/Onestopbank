import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import { useLoader } from '../context/LoaderContext';
import { login } from '../services/auth';
import { errorMessage } from '../lib/http';
import { environment } from '../environment';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const loader = useLoader();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return;
    loader.show('Logging...');
    try {
      const { data } = await login(identifier, password);
      localStorage.setItem(environment.tokenName, data.token);
      loader.hide();
      navigate('/dashboard');
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Login failed'));
      console.error('Login error:', error);
    }
  };

  return (
    <PageTransition className="flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto panel p-8">
        <p className="kicker mb-1.5">Welcome back</p>
        <h2 className="font-display font-semibold text-2xl text-ink mb-7">
          Sign in to your account
        </h2>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="identifier" className="label">
              Account number or email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 305936 or you@mail.com"
              className="field"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-pine transition-colors"
                title="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="text-right mb-6">
            <Link to="/forget-password" className="link text-[13px]">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!identifier || !password}
            className="btn-primary w-full"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-hairline"></span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-stone-400">
            or
          </span>
          <span className="flex-1 h-px bg-hairline"></span>
        </div>

        <Link to="/login/otp" className="btn-ghost w-full">
          <i className="fas fa-envelope-open-text text-xs"></i> Sign in with a
          one-time code
        </Link>

        <p className="text-center text-sm text-stone-500 mt-6">
          New here?{' '}
          <Link to="/register" className="link">
            Open an account
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
