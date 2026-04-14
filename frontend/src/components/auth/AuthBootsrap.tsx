'use client';

import { useEffect } from 'react';
import { fetchCurrentUser } from '@/src/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (!initialized) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized]);

  return null;
}