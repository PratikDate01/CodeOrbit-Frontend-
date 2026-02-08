import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setLoaderCallback } from '../utils/loaderService';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoader = useCallback((msg = '') => {
    setMessage(msg);
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setLoading(false);
    setMessage('');
  }, []);

  useEffect(() => {
    setLoaderCallback((isLoading, msg) => {
      setLoading(isLoading);
      if (msg) setMessage(msg);
      else if (!isLoading) setMessage('');
    });
    return () => setLoaderCallback(null);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading, message, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
