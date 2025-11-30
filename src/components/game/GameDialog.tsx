import { motion, AnimatePresence } from 'framer-motion';

export interface DialogButton {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface GameDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  buttons: DialogButton[];
  onClose?: () => void;
  children?: React.ReactNode;
}

export const GameDialog = ({ isOpen, title, message, buttons, onClose, children }: GameDialogProps) => {
  const getButtonStyles = (variant: DialogButton['variant'] = 'primary') => {
    const baseStyles = 'px-10 py-2 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-b from-uno-purple to-uno-dark-purple rounded-xl font-black text-lg text-white shadow-[0_4px_0_#382f50] active:shadow-[0_2px_0_#382f50] active:translate-y-1 transition-all duration-150 hover:brightness-130 brightness-120';
    return  baseStyles;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none p-1">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 100, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100, rotateX: 15 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.5
              }}
              className="bg-uno-purple rounded-3xl shadow-2xl max-w-lg w-full min-h-[20rem] pointer-events-auto border-4 border-white/20 relative overflow-hidden flex items-center justify-center p-10"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center w-full">
                {/* Title with enhanced styling */}
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-black text-center mb-6 text-white drop-shadow-lg"
                >
                  {title}
                </motion.h2>

                {/* Message or Children */}
                {message && (
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-center text-white/90 mb-8 font-semibold leading-relaxed"
                  >
                    {message}
                  </motion.p>
                )}

                {children && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 w-full"
                  >
                    {children}
                  </motion.div>
                )}

                {/* Buttons with stagger animation */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4 justify-center flex-wrap"
                >
                  {buttons.map((button, index) => (
                    <motion.button
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.4 + (index * 0.1),
                        type: 'spring',
                        stiffness: 300,
                        damping: 20
                      }}
                      onClick={button.onClick}
                      className={getButtonStyles(button.variant)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {button.text}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
