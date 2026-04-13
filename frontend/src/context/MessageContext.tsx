'use client';
import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface MessageContextType {
  messageCount: number;
  decrementMessages: () => void;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  isLimitMessageVisible: boolean;
  setLimitMessageVisible: (visible: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messageCount, setMessageCount] = useState(10);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLimitMessageVisible, setLimitMessageVisible] = useState(false);

  const decrementMessages = () => {
    setMessageCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setLimitMessageVisible(true);
      }
      return newCount;
    });
  };

  return (
    <MessageContext.Provider
      value={{
        messageCount,
        decrementMessages,
        isLoginModalOpen,
        setLoginModalOpen,
        isLimitMessageVisible,
        setLimitMessageVisible,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};
