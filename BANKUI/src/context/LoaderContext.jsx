import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LoaderContext = createContext({ show: () => {}, hide: () => {} });

export function LoaderProvider({ children }) {
  const [state, setState] = useState({ visible: false, message: '' });

  const show = useCallback(
    (message = 'Loading...') => setState({ visible: true, message }),
    []
  );
  const hide = useCallback(
    () => setState({ visible: false, message: '' }),
    []
  );

  return (
    <LoaderContext.Provider value={{ show, hide }}>
      {children}
      <AnimatePresence>
        {state.visible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="panel px-8 py-6 flex flex-col items-center"
              initial={{ scale: 0.92, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 8, opacity: 0 }}
            >
              <div className="w-10 h-10 border-[3px] border-pine/20 border-t-pine rounded-full animate-spin" />
              <p className="mt-4 text-sm font-semibold text-ink">
                {state.message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
