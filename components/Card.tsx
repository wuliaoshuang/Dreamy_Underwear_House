import React from 'react';
import { GachaItem, Rarity, RarityColors } from '../types';
import { Star } from 'lucide-react';

interface CardProps {
  item: GachaItem;
  onClick?: () => void;
  isNew?: boolean;
}

export const Card: React.FC<CardProps> = ({ item, onClick, isNew }) => {
  const colors = RarityColors[item.rarity];
  const isHighRarity = item.rarity === Rarity.LEGENDARY || item.rarity === Rarity.EPIC;
  
  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-300 hover:scale-[1.03]`}
    >
      {isNew && (
        <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-red-400 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm animate-bounce">
          NEW!
        </div>
      )}
      
      <div className={`
        bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl
        flex flex-col h-full border-[3px] ${colors.border}
        relative z-10
      `}>
        {/* Header with Rarity Stars */}
        <div className={`${colors.bg} px-2 py-1.5 flex justify-between items-center border-b ${colors.border}`}>
           {/* Rarity Dots/Stars */}
           <div className="flex gap-0.5 mx-auto">
             {item.rarity === Rarity.LEGENDARY && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
             {item.rarity === Rarity.LEGENDARY && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
             {item.rarity === Rarity.LEGENDARY && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
             {item.rarity === Rarity.EPIC && <Star size={10} className="text-purple-500 fill-purple-500" />}
             {item.rarity === Rarity.EPIC && <Star size={10} className="text-purple-500 fill-purple-500" />}
             {(item.rarity === Rarity.RARE || item.rarity === Rarity.EPIC) && <Star size={10} className="text-pink-500 fill-pink-500" />}
             <Star size={10} className="text-gray-300 fill-gray-300" />
          </div>
        </div>

        {/* Image Area with Holo Effect for High Rarity */}
        <div className={`relative aspect-[3/4] bg-gray-50 overflow-hidden ${isHighRarity ? 'holo-effect' : ''}`}>
           <img 
             src={item.imageUrl} 
             alt={item.name} 
             className="w-full h-full object-cover" 
             loading="lazy"
           />
           {/* Gradient overlay at bottom for text readability if needed, but we have footer */}
        </div>

        {/* Footer */}
        <div className="p-2.5 text-center bg-white flex-1 flex flex-col justify-center">
          <h3 className="font-bold text-gray-700 text-xs sm:text-sm mb-1 line-clamp-1">{item.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mx-auto ${colors.bg} ${colors.text} font-medium`}>
            {item.rarity}
          </span>
        </div>
      </div>

      {/* Glow Backdrop */}
      {isHighRarity && (
        <div className={`absolute -inset-1.5 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity -z-10 animate-pulse 
          ${item.rarity === Rarity.LEGENDARY ? 'bg-gradient-to-tr from-yellow-300 via-orange-300 to-yellow-300' : 'bg-purple-300'}`}></div>
      )}
    </div>
  );
};