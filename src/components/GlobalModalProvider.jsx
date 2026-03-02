"use client";

import { createContext, useContext, useState, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ModalContext = createContext();
export const useGlobalModal = () => useContext(ModalContext);

function GlobalModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openModal = useCallback((node) => {
    setContent(node);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 320);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeModal}
            aria-hidden={!isOpen}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-[95vw] sm:max-w-3xl md:max-w-5xl max-h-[92vh] overflow-hidden bg-white/6 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(6,200,200,0.06)] flex flex-col sm:flex-row p-3 sm:p-6"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full overflow-y-auto no-scrollbar">{content}</div>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white text-2xl font-bold hover:bg-white/20 hover:scale-105 transition"
                type="button"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

export default memo(GlobalModalProvider);