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
    const baseStyles = 'px-8 py-4 h-12 w-48 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg';

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-uno-yellow to-yellow-400 text-black hover:from-yellow-400 hover:to-uno-yellow hover:shadow-xl`;
      case 'secondary':
        return `${baseStyles} bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 hover:shadow-xl`;
      case 'danger':
        return `${baseStyles} bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-xl`;
      default:
        return `${baseStyles} bg-gradient-to-r from-uno-yellow to-yellow-400 text-black hover:from-yellow-400 hover:to-uno-yellow hover:shadow-xl`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none p-4">
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
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl max-w-lg w-full min-h-[20rem] pointer-events-auto border-4 border-uno-yellow relative overflow-hidden flex items-center justify-center p-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-uno-yellow opacity-10 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-uno-red opacity-10 rounded-full -ml-16 -mb-16" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center w-full gap-8">
                {/* Title with enhanced styling */}
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-black text-center mb-6 bg-gradient-to-r from-uno-purple to-uno-blue bg-clip-text text-transparent drop-shadow-lg"
                >
                  {title}
                </motion.h2>

                {/* Message or Children */}
                {message && (
                  <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-center text-gray-700 mb-8 font-semibold leading-relaxed"
                  >
                    {message}
                  </motion.p>
                )}

                {children && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
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
