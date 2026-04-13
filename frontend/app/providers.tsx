'use client';

import type { ReactNode } from 'react';
import { MessageProvider } from '@/src/context/MessageContext';

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return <MessageProvider>{children}</MessageProvider>;
}