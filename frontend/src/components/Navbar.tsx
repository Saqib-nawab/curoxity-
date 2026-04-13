'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMessageContext } from '@/src/context/MessageContext';
import { signoutUser } from '@/src/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

const imgHeaderLogo = '/navbarLogo.svg';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const { setLoginModalOpen } = useMessageContext();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const firstName = useMemo(() => {
    if (!user?.full_name) return '';
    return user.full_name.trim().split(' ')[0] || '';
  }, [user]);

  const handleSignOut = async () => {
    await dispatch(signoutUser());
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'left-0 right-0 bg-white/70 backdrop-blur-sm'
          : 'top-4 left-4 right-4'
      }`}
    >
      <div className="w-full max-w-[1780px] mx-auto h-[64px] md:h-[76px] px-4 md:px-10 flex justify-between items-center">
        <div
          className="h-[28px] md:h-[33px] w-[88px] md:w-[88px] shrink-0 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <img
            alt="clinEvidence"
            className="w-full h-full object-contain"
            src={imgHeaderLogo}
          />
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <div
              className={`w-[5px] h-[5px] rounded-full group-hover:scale-110 transition-transform ${
                pathname === '/' ? 'bg-text-primary' : 'bg-transparent'
              }`}
            />
            <span
              className={`font-noto-sans font-regular group-hover:text-brand-primary transition-colors ${
                pathname === '/'
                  ? 'font-bold text-text-primary'
                  : 'text-text-secondary'
              }`}
            >
              Search
            </span>
          </div>

          <span
            className={`font-noto-sans cursor-pointer hover:font-bold hover:text-brand-primary transition-all flex items-center gap-2 ${
              pathname.startsWith('/trials')
                ? 'font-bold text-text-primary'
                : 'text-text-secondary'
            }`}
            onClick={() => router.push('/trials')}
          >
            {pathname.startsWith('/trials') && (
              <div className="w-[5px] h-[5px] rounded-full bg-text-primary" />
            )}
            Trials
          </span>

          <span
            className={`font-noto-sans cursor-pointer hover:font-bold hover:text-brand-primary transition-all flex items-center gap-2 ${
              pathname === '/how-it-works'
                ? 'font-bold text-text-primary'
                : 'text-text-secondary'
            }`}
            onClick={() => router.push('/how-it-works')}
          >
            {pathname === '/how-it-works' && (
              <div className="w-[5px] h-[5px] rounded-full bg-text-primary" />
            )}
            How it Works
          </span>
        </nav>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm font-medium text-text-primary">
              Hi, {firstName}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-white/60 backdrop-blur-md border border-white px-6 py-2.5 rounded-2xl font-noto-sans text-text-primary hover:bg-white/80 transition-all font-medium shadow-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLoginModalOpen(true)}
            className="bg-white/60 backdrop-blur-md border border-white px-6 py-2.5 rounded-2xl font-noto-sans text-text-primary hover:bg-white/80 transition-all font-medium shadow-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}