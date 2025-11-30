import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

interface ColorPickerDialogProps {
  isOpen: boolean;
  onColorSelect: (color: number) => void;
  message?: string;
  isInteractive?: boolean;
  selectedColor?: number;
}

const COLOR_OPTIONS = [
  { color: 0, name: 'Red', bgColor: 'bg-uno-red', hoverColor: 'hover:bg-red-600' },
  { color: 1, name: 'Blue', bgColor: 'bg-uno-blue', hoverColor: 'hover:bg-blue-600' },
  { color: 2, name: 'Green', bgColor: 'bg-uno-green', hoverColor: 'hover:bg-green-600' },
  { color: 3, name: 'Yellow', bgColor: 'bg-uno-yellow', hoverColor: 'hover:bg-yellow-500' },
];

export const ColorPickerDialog = ({
  isOpen,
  onColorSelect,
  message = 'Choose a color',
  isInteractive = true,
  selectedColor
}: ColorPickerDialogProps) => {
  const handleColorClick = (color: number) => {
    if (isInteractive) {
      onColorSelect(color);
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
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none">
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
                {/* Title */}
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl font-black text-center mb-6 text-white drop-shadow-lg"
                >
                  {message}
                </motion.h2>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 gap-6 w-full max-w-sm"
                >
                  {COLOR_OPTIONS.map((option) => {
                    const isSelected = !isInteractive && selectedColor === option.color;

                    return (
                      <motion.button
                        key={option.color}
                        onClick={() => handleColorClick(option.color)}
                        disabled={!isInteractive}
                        className={`
                          ${option.bgColor} ${isInteractive ? option.hoverColor : ''}
                          rounded-xl p36 text-white font-bold text-2xl
                          shadow-lg transition-all transform
                          ${isInteractive ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'}
                          ${isSelected ? 'opacity-100 scale-110 ring-4 ring-white' : !isInteractive ? 'opacity-30' : 'opacity-100'}
                          flex flex-col items-center justify-center gap-2
                          min-h-[120px] relative
                        `}
                        animate={isSelected ? { scale: [1, 1.1, 1.05] } : {}}
                        transition={{ duration: 0.5 }}
                        whileHover={isInteractive ? { y: -4 } : {}}
                        whileTap={isInteractive ? { scale: 0.95 } : {}}
                      >
                        <div className={`w-10 h-10 rounded-lg shadow-lg ${option.bgColor} border-3 border-white shadow-md transform rotate-45`} />
                        <span className="drop-shadow-md">{option.name}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
