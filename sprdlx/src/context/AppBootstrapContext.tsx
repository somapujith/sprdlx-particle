import { createContext, useContext, type ReactNode } from 'react';

type Value = { isBootLoaderComplete: boolean };

const AppBootstrapContext = createContext<Value>({ isBootLoaderComplete: false });

export function AppBootstrapProvider({
  isBootLoaderComplete,
  children,
}: {
  isBootLoaderComplete: boolean;
  children: ReactNode;
}) {
  return (
    <AppBootstrapContext.Provider value={{ isBootLoaderComplete }}>{children}</AppBootstrapContext.Provider>
  );
}

export function useAppBootstrap(): Value {
  return useContext(AppBootstrapContext);
}
