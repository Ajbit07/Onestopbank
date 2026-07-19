import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Otp from './pages/Otp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import FundTransfer from './pages/FundTransfer';
import AccountPin from './pages/AccountPin';
import AccountDetails from './pages/AccountDetails';
import Profile from './pages/Profile';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import NotFound from './pages/NotFound';
import { isLoggedIn } from './lib/http';

export default function App() {
  const location = useLocation();

  return (
    <div className="content-wrapper">
      <div className="left-pannel">
        <Sidebar />
      </div>
      <div className="right-pannel bg-paper">
        <Header />
        <div className="p-[5px] md:p-2 flex flex-1 w-full">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Home />}
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/deposit"
                element={
                  <RequireAuth>
                    <Deposit />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/withdraw"
                element={
                  <RequireAuth>
                    <Withdraw />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/fund-transfer"
                element={
                  <RequireAuth>
                    <FundTransfer />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/pin"
                element={
                  <RequireAuth>
                    <AccountPin />
                  </RequireAuth>
                }
              />
              <Route
                path="/account"
                element={
                  <RequireAuth>
                    <AccountDetails />
                  </RequireAuth>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/account/transaction-history"
                element={
                  <RequireAuth>
                    <TransactionHistoryPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login/otp" element={<Otp />} />
              <Route path="/forget-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
