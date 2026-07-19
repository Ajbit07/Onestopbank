import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logOutUser } from '../services/auth';
import { errorMessage, isLoggedIn } from '../lib/http';
import { environment } from '../environment';
import Wordmark from './Wordmark';

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const smallScreen = window.innerWidth < 768;

  const logout = async () => {
    try {
      await logOutUser();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(errorMessage(error));
    } finally {
      localStorage.removeItem(environment.tokenName);
      navigate('/');
    }
  };

  return (
    <header className="bg-linen/90 backdrop-blur-sm border-b border-hairline sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div>{(!loggedIn || smallScreen) && <Wordmark />}</div>

        <div className="flex items-center gap-2.5">
          {!loggedIn && (
            <>
              <Link to="/login" className="btn-ghost">
                <i className="fas fa-sign-in-alt text-xs"></i> Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Open an account
              </Link>
            </>
          )}
          {loggedIn && (
            <button type="button" className="btn-ghost" onClick={logout}>
              <i className="fas fa-sign-out-alt text-xs"></i> Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
