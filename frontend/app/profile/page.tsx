'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { fetchCurrentUser } from '@/src/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const formatBoolean = (value: boolean) => (value ? 'Yes' : 'No');

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[18px] border border-white bg-white/55 px-4 py-4">
      <span className="text-[12px] uppercase tracking-[0.08em] text-text-muted font-noto-sans">
        {label}
      </span>
      <span className="text-[15px] text-text-primary font-noto-sans break-words">
        {value === null || value === undefined || value === '' ? '—' : String(value)}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    void dispatch(fetchCurrentUser());
  }, [dispatch]);

  const messagesRemaining = useMemo(() => {
    if (!user) return 0;
    return Math.max(0, user.daily_message_limit - user.daily_message_used);
  }, [user]);

  const rawProfileJson = useMemo(() => {
    if (!user) return '';
    return JSON.stringify(user, null, 2);
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f1f4fb] flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 pt-[120px] pb-[100px] px-4 md:px-8 lg:px-12">
        <div className="max-w-[1480px] mx-auto">
          <div className="rounded-[28px] border border-white bg-white/35 backdrop-blur-md p-4 md:p-6 lg:p-8">
            <div className="flex flex-col gap-3 mb-8">
              <h1 className="font-outfit text-[28px] md:text-[36px] text-text-primary">
                Your Profile
              </h1>
              <p className="font-noto-sans text-[15px] md:text-[16px] text-text-secondary max-w-[760px]">
                This page shows all safe user information currently returned by the
                backend for your account.
              </p>
            </div>

            {!initialized || loading ? (
              <div className="rounded-[24px] border border-white bg-white/55 px-6 py-10 text-center font-noto-sans text-text-secondary">
                Loading your profile...
              </div>
            ) : !isAuthenticated || !user ? (
              <div className="rounded-[24px] border border-white bg-white/55 px-6 py-10 flex flex-col items-center text-center gap-4">
                <h2 className="font-outfit text-[24px] text-text-primary">
                  You are not signed in
                </h2>
                <p className="font-noto-sans text-text-secondary max-w-[520px]">
                  Sign in to view your profile, account status, onboarding progress,
                  and message quota.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push('/signin')}
                    className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-noto-sans font-medium hover:bg-brand-primary/90 transition-all"
                  >
                    Go to Sign In
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-white/70 border border-white px-6 py-3 rounded-2xl font-noto-sans font-medium text-text-primary hover:bg-white transition-all"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <section className="rounded-[24px] border border-white bg-white/50 p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="flex items-center gap-4">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-16 h-16 rounded-full object-cover border border-white"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-brand-primary/20 border border-white flex items-center justify-center text-text-primary font-outfit text-[24px]">
                          {(user.full_name?.trim()?.[0] || 'U').toUpperCase()}
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        <h2 className="font-outfit text-[24px] text-text-primary">
                          {user.full_name || 'Unnamed User'}
                        </h2>
                        <p className="font-noto-sans text-[15px] text-text-secondary">
                          {user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 rounded-full bg-white/70 border border-white text-[12px] font-noto-sans text-text-primary">
                            Role: {user.role}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/70 border border-white text-[12px] font-noto-sans text-text-primary">
                            Status: {user.status}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/70 border border-white text-[12px] font-noto-sans text-text-primary">
                            Auth: {user.auth_provider}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-white bg-white/70 px-5 py-4 min-w-[260px]">
                      <p className="font-noto-sans text-[13px] text-text-muted uppercase tracking-[0.08em] mb-2">
                        Message Usage
                      </p>
                      <p className="font-outfit text-[28px] text-text-primary">
                        {messagesRemaining} left
                      </p>
                      <p className="font-noto-sans text-[14px] text-text-secondary mt-1">
                        {user.daily_message_used} used out of {user.daily_message_limit}
                      </p>
                      <p className="font-noto-sans text-[12px] text-text-muted mt-2">
                        Resets: {formatDateTime(user.daily_message_reset_at)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-[24px] border border-white bg-white/50 p-5 md:p-6">
                    <h3 className="font-outfit text-[22px] text-text-primary mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField label="User ID" value={user.user_id} />
                      <ProfileField label="Email" value={user.email} />
                      <ProfileField label="Full Name" value={user.full_name} />
                      <ProfileField label="Avatar URL" value={user.avatar_url} />
                      <ProfileField
                        label="Email Verified"
                        value={formatBoolean(user.email_verified)}
                      />
                      <ProfileField label="Auth Provider" value={user.auth_provider} />
                      <ProfileField label="Role" value={user.role} />
                      <ProfileField label="Status" value={user.status} />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white bg-white/50 p-5 md:p-6">
                    <h3 className="font-outfit text-[22px] text-text-primary mb-4">
                      Onboarding & Usage
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileField
                        label="Onboarding Completed"
                        value={formatBoolean(user.onboarding_completed)}
                      />
                      <ProfileField
                        label="Onboarding Step"
                        value={user.onboarding_step}
                      />
                      <ProfileField
                        label="Daily Message Limit"
                        value={user.daily_message_limit}
                      />
                      <ProfileField
                        label="Daily Message Used"
                        value={user.daily_message_used}
                      />
                      <ProfileField
                        label="Daily Message Reset At"
                        value={formatDateTime(user.daily_message_reset_at)}
                      />
                      <ProfileField
                        label="Messages Remaining"
                        value={messagesRemaining}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-white bg-white/50 p-5 md:p-6">
                  <h3 className="font-outfit text-[22px] text-text-primary mb-4">
                    Security & Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <ProfileField
                      label="Last Login At"
                      value={formatDateTime(user.last_login_at)}
                    />
                    <ProfileField
                      label="Last Login IP"
                      value={user.last_login_ip}
                    />
                    <ProfileField
                      label="Created At"
                      value={formatDateTime(user.created_at)}
                    />
                    <ProfileField
                      label="Updated At"
                      value={formatDateTime(user.updated_at)}
                    />
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}