'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { clearAuthError, signinUser, signupUser } from '@/src/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

type AuthMode = 'signin' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: () => void;
  redirectTo?: string;
  isModal?: boolean;
};

type FormErrors = {
  full_name?: string;
  email?: string;
  password?: string;
  terms?: string;
  form?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordByteLength = (value: string) => new TextEncoder().encode(value).length;

export default function AuthForm({
  mode,
  onModeChange,
  onSuccess,
  redirectTo,
  isModal = false,
}: AuthFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const title = useMemo(() => {
    return mode === 'signin' ? 'Welcome back' : 'Create an account';
  }, [mode]);

  const subtitle = useMemo(() => {
    return mode === 'signin'
      ? 'Log in to continue finding trials that match your needs.'
      : 'Join Curexity to explore personalized clinical trials.';
  }, [mode]);

  const switchMode = (nextMode: AuthMode) => {
    dispatch(clearAuthError());
    setFormErrors({});

    if (onModeChange) {
      onModeChange(nextMode);
      return;
    }

    router.push(nextMode === 'signin' ? '/signin' : '/signup');
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (mode === 'signup') {
      if (!fullName.trim()) {
        nextErrors.full_name = 'Full name is required.';
      } else if (fullName.trim().length < 2) {
        nextErrors.full_name = 'Full name must be at least 2 characters.';
      } else if (fullName.trim().length > 120) {
        nextErrors.full_name = 'Full name must be 120 characters or fewer.';
      }
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const byteLen = passwordByteLength(password);

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    } else if (byteLen > 72) {
      nextErrors.password =
        'Password is too long for the current auth setup. Please keep it within 72 bytes.';
    }

    if (mode === 'signup' && !acceptedTerms) {
      nextErrors.terms = 'Please accept the terms and privacy policy.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'signup') {
        await dispatch(
          signupUser({
            full_name: fullName.trim(),
            email: email.trim(),
            password,
          })
        ).unwrap();
      } else {
        await dispatch(
          signinUser({
            email: email.trim(),
            password,
          })
        ).unwrap();
      }

      onSuccess?.();

      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (thunkError) {
      setFormErrors((prev) => ({
        ...prev,
        form:
          typeof thunkError === 'string'
            ? thunkError
            : mode === 'signin'
              ? 'Sign in failed.'
              : 'Sign up failed.',
      }));
    }
  };

  return (
    <div className="w-full max-w-[360px]">
      <div className="flex bg-[#f1f5f9] p-1 rounded-[14px] mb-6 w-fit mx-auto px-1 border border-[#f1f5f9] shadow-sm">
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className={`px-8 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all ${
            mode === 'signin'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-[#64748b] hover:text-[#475569]'
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => switchMode('signup')}
          className={`px-8 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all ${
            mode === 'signup'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-[#64748b] hover:text-[#475569]'
          }`}
        >
          Sign up
        </button>
      </div>

      <div className="text-center mb-5">
        <h3 className="font-outfit text-[24px] text-[#0f172a] mb-1 font-normal">
          {title}
        </h3>
        <p className="font-noto-sans text-[14px] text-[#64748b]">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-[13px] font-semibold text-[#334155] mb-2 ml-1">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl focus:outline-none focus:ring-2 transition-all font-noto-sans text-[15px] placeholder:text-slate-400 ${
                formErrors.full_name
                  ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                  : 'border-border-default focus:ring-brand-primary/10 focus:border-brand-primary'
              }`}
            />
            <p className="mt-2 ml-1 text-[12px] text-[#64748b]">
              Enter your full name. Minimum 2 characters.
            </p>
            {formErrors.full_name && (
              <p className="mt-1 ml-1 text-[12px] text-red-500">
                {formErrors.full_name}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-[13px] font-semibold text-[#334155] mb-2 ml-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl focus:outline-none focus:ring-2 transition-all font-noto-sans text-[15px] placeholder:text-slate-400 ${
              formErrors.email
                ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                : 'border-border-default focus:ring-brand-primary/10 focus:border-brand-primary'
            }`}
          />
          <p className="mt-2 ml-1 text-[12px] text-[#64748b]">
            Use a valid email address, for example: you@example.com
          </p>
          {formErrors.email && (
            <p className="mt-1 ml-1 text-[12px] text-red-500">
              {formErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#334155] mb-2 ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={
              mode === 'signin'
                ? 'Enter your password'
                : 'Create a strong password'
            }
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className={`w-full px-4 py-3 bg-[#F8FAFC] border rounded-xl focus:outline-none focus:ring-2 transition-all font-noto-sans text-[15px] placeholder:text-slate-400 ${
              formErrors.password
                ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                : 'border-border-default focus:ring-brand-primary/10 focus:border-brand-primary'
            }`}
          />
          <p className="mt-2 ml-1 text-[12px] text-[#64748b]">
            Password must be at least 8 characters and no more than 72 bytes.
          </p>
          {formErrors.password && (
            <p className="mt-1 ml-1 text-[12px] text-red-500">
              {formErrors.password}
            </p>
          )}
        </div>

        {mode === 'signin' ? (
          <label className="flex items-center gap-2 py-1 ml-1 text-[13px] text-[#64748b] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="w-4 h-4 rounded border-[#cbd5e1] text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
            Remember me
          </label>
        ) : (
          <div>
            <label className="flex items-center gap-2 py-1 ml-1 text-[13px] text-[#64748b] cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="w-4 h-4 rounded border-[#cbd5e1] text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
              I agree to the terms and privacy policy
            </label>
            {formErrors.terms && (
              <p className="mt-1 ml-1 text-[12px] text-red-500">
                {formErrors.terms}
              </p>
            )}
          </div>
        )}

        {(formErrors.form || error) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {formErrors.form || error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-primary/20 mt-2"
        >
          {loading ? 'Please wait...' : mode === 'signin' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      {!isModal && (
        <div className="mt-4 text-center text-[12px] text-[#64748b]">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand-primary font-bold hover:underline ml-1">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/signin" className="text-brand-primary font-bold hover:underline ml-1">
                Log in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}