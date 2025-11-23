interface PlayerAvatarProps {
  name: string;
  cardCount: number;
  isCurrentPlayer?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const PlayerAvatar = ({
  name,
  cardCount,
  isCurrentPlayer = false,
}: PlayerAvatarProps) => {

  return (
    <div className={`flex flex-col items-center gap-2`}>
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-3 border-white shadow-lg flex items-center justify-center ${
            isCurrentPlayer ? 'ring-4 ring-white ring-opacity-50' : ''
          }`}
        >
          <div className="text-2xl">👤</div>
        </div>

        {/* Card count badge */}
        <div className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-purple-600 shadow-md">
          <span className="text-xs font-bold text-purple-600">{cardCount}</span>
        </div>
      </div>

      <div className="text-white font-semibold text-lg">
        {name}
      </div>
    </div>
  );
};
