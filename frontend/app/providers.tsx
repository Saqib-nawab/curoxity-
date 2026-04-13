'use client';

import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { MessageProvider } from '@/src/context/MessageContext';
import { store } from '@/src/store/store';
import AuthBootstrap from '@/src/components/auth/AuthBootsrap';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <MessageProvider>
        <AuthBootstrap />
        {children}
      </MessageProvider>
    </ReduxProvider>
  );
}