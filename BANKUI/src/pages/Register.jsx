import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PageTransition from '../components/PageTransition';
import { registerUser } from '../services/auth';
import { errorMessage } from '../lib/http';
import { StrongPasswordRegx } from '../util/formutil';
import { countries } from '../util/countries';

const initialForm = {
  name: '',
  email: '',
  countryCode: 'IN',
  phoneNumber: '',
  address: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const errors = {
    name: !form.name ? 'Name is required' : '',
    email: !form.email
      ? 'Email is required'
      : !/^\S+@\S+\.\S+$/.test(form.email)
      ? 'Enter a valid email'
      : '',
    phoneNumber: !form.phoneNumber
      ? 'Phone number is required'
      : !isValidPhoneNumber(form.phoneNumber, form.countryCode)
      ? 'Invalid phone number'
      : '',
    address: !form.address ? 'Address is required' : '',
    password: !form.password
      ? 'Password is required'
      : !StrongPasswordRegx.test(form.password)
      ? 'Min 8 chars with uppercase, lowercase and a digit'
      : '',
    confirmPassword:
      form.confirmPassword !== form.password ? 'Passwords do not match' : '',
  };
  const isValid = Object.values(errors).every((e) => !e);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      password: true,
      confirmPassword: true,
    });
    if (!isValid) return;
    try {
      const { data } = await registerUser(form);
      setRegistrationData(data);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(errorMessage(error, 'Registration failed'));
    }
  };

  const err = (field) =>
    touched[field] && errors[field] ? (
      <p className="text-clay text-xs mt-1.5">{errors[field]}</p>
    ) : null;

  if (registrationData) {
    return (
      <PageTransition className="flex items-center justify-center py-12">
        <motion.div
          className="w-full max-w-lg mx-auto panel p-8"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.span
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pine-soft text-pine mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.15 }}
          >
            <i className="fas fa-check text-lg"></i>
          </motion.span>
          <h2 className="font-display font-semibold text-2xl text-ink mb-2">
            You're in.
          </h2>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            Write down your account number somewhere safe — you'll use it to
            sign in.
          </p>

          <div className="border border-hairline rounded-md divide-y divide-hairline mb-7 bg-white">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-stone-500">Name</span>
              <span className="font-semibold text-ink">
                {registrationData.name}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-stone-500">Email</span>
              <span className="font-semibold text-ink">
                {registrationData.email}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm bg-pine-soft/50">
              <span className="text-stone-600 font-medium">Account number</span>
              <span className="font-display font-bold text-pine text-base tnum">
                {registrationData.accountNumber}
              </span>
            </div>
            {registrationData.ifscCode && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-stone-500">IFSC</span>
                <span className="font-semibold text-ink">
                  {registrationData.ifscCode}
                </span>
              </div>
            )}
            {registrationData.branch && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-stone-500">Branch</span>
                <span className="font-semibold text-ink">
                  {registrationData.branch}
                </span>
              </div>
            )}
            {registrationData.accountType && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-stone-500">Account type</span>
                <span className="font-semibold text-ink">
                  {registrationData.accountType}
                </span>
              </div>
            )}
          </div>

          <Link to="/login" className="btn-primary w-full">
            Continue to sign in
          </Link>
        </motion.div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="flex items-center justify-center py-12">
      <div className="w-full max-w-lg mx-auto panel p-8">
        <p className="kicker mb-1.5">Takes about a minute</p>
        <h2 className="font-display font-semibold text-2xl text-ink mb-7">
          Open an account
        </h2>

        <form onSubmit={onSubmit} noValidate>
          <div className="mb-4">
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={set('name')}
              onBlur={blur('name')}
              placeholder="As it appears on your ID"
              className="field"
            />
            {err('name')}
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              onBlur={blur('email')}
              placeholder="you@mail.com"
              className="field"
            />
            {err('email')}
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <div>
              <label className="label" htmlFor="countryCode">
                Country
              </label>
              <select
                id="countryCode"
                value={form.countryCode}
                onChange={set('countryCode')}
                className="field"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.dial})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label" htmlFor="phoneNumber">
                Phone number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={set('phoneNumber')}
                onBlur={blur('phoneNumber')}
                placeholder="Mobile number"
                className="field tnum"
              />
              {err('phoneNumber')}
            </div>
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              value={form.address}
              onChange={set('address')}
              onBlur={blur('address')}
              placeholder="Street, city, PIN code"
              rows={2}
              className="field resize-none"
            />
            {err('address')}
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                onBlur={blur('password')}
                placeholder="8+ characters, mixed case, a number"
                className="field pr-10"
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
            {err('password')}
          </div>

          <div className="mb-7">
            <label className="label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              onBlur={blur('confirmPassword')}
              placeholder="Same one again"
              className="field"
            />
            {err('confirmPassword')}
          </div>

          <button type="submit" className="btn-primary w-full">
            Create my account
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already banking with us?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
