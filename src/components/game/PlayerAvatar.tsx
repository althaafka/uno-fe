import { motion, AnimatePresence } from 'framer-motion';

interface PlayerAvatarProps {
  name: string;
  cardCount: number;
  isCurrentPlayer?: boolean;
  showUnoBalloon?: boolean;
}

export const PlayerAvatar = ({
  name,
  cardCount,
  isCurrentPlayer = false,
  showUnoBalloon = false,
}: PlayerAvatarProps) => {

  return (
    <div className={`flex flex-col items-center gap-2`}>
      <div className="relative">
        <AnimatePresence>
          {showUnoBalloon && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: -15 }}
              exit={{ scale: 0, opacity: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              
              className="absolute h-7 w-14 -bottom-6 -right-6 z-50 bg-red-600 text-white text-m font-black rounded-xl border-2 border-white shadow-xl flex items-center justify-center whitespace-nowrap"
            >
              UNO!
              <div className="absolute -top-1 left-2 w-2 h-2 bg-red-600 transform rotate-45 border-t-2 border-l-2 border-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar with pulsing animation */}
        <motion.div
          animate={
            isCurrentPlayer
              ? {
                  boxShadow: [
                    '0 0 0 0px rgba(255, 255, 255, 0.8)',
                    '0 0 0 20px rgba(255, 255, 255, 0)',
                  ],
                }
              : {
                  boxShadow: '0 0 0 0px rgba(255,255,255,0)',
              }
          }
          transition={
            isCurrentPlayer
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                }
              : {              }
          }
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-white shadow-lg flex items-center justify-center"
        >
          <div className="text-2xl">👤</div>
        </motion.div>

        {/* Card count badge */}
        <div className={`absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center border-2 shadow-md transition-colors duration-300 ${
          isCurrentPlayer ? 'border-yellow-400' : 'border-purple-600'
        }`}>
          <span className={`text-xs font-bold transition-colors duration-300 ${
            isCurrentPlayer ? 'text-yellow-600' : 'text-purple-600'
          }`}>{cardCount}</span>
        </div>
      </div>

      <div className={`text-white font-semibold text-sm text-center transition-all duration-300 ${
        isCurrentPlayer ? 'text-white-500' : ''
      }`}>
        {name}
      </div>
    </div>
  );
};
