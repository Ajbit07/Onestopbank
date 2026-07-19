import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PageTransition from '../components/PageTransition';
import { getUserDetails, updateUserProfile } from '../services/auth';
import { errorMessage } from '../lib/http';
import { countries } from '../util/countries';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: 'IN',
    phoneNumber: '',
    address: '',
    password: '',
  });

  useEffect(() => {
    getUserDetails()
      .then(({ data }) => {
        setProfile(data);
        setForm((f) => ({ ...f, ...data, password: '' }));
      })
      .catch((error) =>
        console.error('Error fetching user profile data:', error)
      );
  }, []);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const phoneValid =
    form.phoneNumber && isValidPhoneNumber(form.phoneNumber, form.countryCode);
  const isValid =
    form.name &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    phoneValid &&
    form.address &&
    form.password.length >= 8;

  const toggleUpdateForm = () => {
    setForm((f) => ({ ...f, ...profile, password: '' }));
    setShowUpdateForm((s) => !s);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      const { data } = await updateUserProfile(form);
      setProfile(data);
      console.log('Profile updated successfully:', data);
      toast.success('Profile updated successfully');
      setShowUpdateForm(false);
    } catch (error) {
      toast.error(errorMessage(error, 'Error updating profile'));
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <PageTransition className="py-8">
      <div className="max-w-2xl mx-auto px-2">
        <motion.div
          className="panel p-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-7">
            <div>
              <p className="kicker mb-1.5">Your details</p>
              <h2 className="font-display font-semibold text-2xl text-ink">
                Profile
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleUpdateForm}
              className={showUpdateForm ? 'btn-ghost' : 'btn-primary'}
            >
              {showUpdateForm ? 'Cancel' : 'Edit details'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!showUpdateForm ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <dl className="divide-y divide-hairline border border-hairline rounded-md bg-white">
                  <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm">
                    <dt className="text-stone-500">Name</dt>
                    <dd className="col-span-2 font-semibold text-ink">
                      {profile?.name}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm">
                    <dt className="text-stone-500">Email</dt>
                    <dd className="col-span-2 font-semibold text-ink break-all">
                      {profile?.email}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm">
                    <dt className="text-stone-500">Phone</dt>
                    <dd className="col-span-2 font-semibold text-ink tnum">
                      {profile?.phoneNumber}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm">
                    <dt className="text-stone-500">Country</dt>
                    <dd className="col-span-2 font-semibold text-ink">
                      {profile?.countryCode}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm">
                    <dt className="text-stone-500">Address</dt>
                    <dd className="col-span-2 font-semibold text-ink">
                      {profile?.address}
                    </dd>
                  </div>
                  {profile?.accountNumber && (
                    <div className="grid grid-cols-3 gap-4 px-4 py-3.5 text-sm bg-pine-soft/40">
                      <dt className="text-stone-600 font-medium">
                        Account no.
                      </dt>
                      <dd className="col-span-2 font-bold text-pine tnum">
                        {profile.accountNumber}
                      </dd>
                    </div>
                  )}
                </dl>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                onSubmit={updateProfile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4">
                  <label className="label" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    className="field"
                  />
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
                    className="field"
                  />
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
                      className="field tnum"
                    />
                    {form.phoneNumber && !phoneValid && (
                      <p className="text-clay text-xs mt-1.5">
                        Invalid phone number
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="label" htmlFor="address">
                    Address
                  </label>
                  <textarea
                    id="address"
                    rows={2}
                    value={form.address}
                    onChange={set('address')}
                    className="field resize-none"
                  />
                </div>
                <div className="mb-7">
                  <label className="label" htmlFor="password">
                    Confirm with your password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Required to save changes"
                    className="field"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className="btn-primary w-full"
                >
                  Save changes
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  );
}
