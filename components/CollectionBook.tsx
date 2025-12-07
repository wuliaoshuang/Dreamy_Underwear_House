import React from 'react';
import { FEATURED_ITEMS, THEMES } from '../data/gameData';
import { GachaItem } from '../types';
import { Lock, Sparkles, BookOpen, Star, Trophy, Crown } from 'lucide-react';

interface CollectionBookProps {
  inventory: GachaItem[];
}

export const CollectionBook: React.FC<CollectionBookProps> = ({ inventory }) => {

  // Helper to find if a specific collection ID is owned
  const findItem = (id: string, nameFallback?: string) => {
    // 1. Check exact ID match (for new items)
    const exactMatch = inventory.find(i => i.collectionId === id);
    if (exactMatch) return exactMatch;

    // 2. Fallback for old items
    if (nameFallback) {
      return inventory.find(i => i.name.includes(nameFallback));
    }
    return undefined;
  };

  const calculateProgress = () => {
    const totalSlots = FEATURED_ITEMS.length + THEMES.length;
    let unlocked = 0;
    
    FEATURED_ITEMS.forEach(item => {
      if (findItem(item.id)) unlocked++;
    });
    
    THEMES.forEach(theme => {
      if (findItem(theme.id, theme.name)) unlocked++;
    });

    return Math.round((unlocked / totalSlots) * 100);
  };

  const progress = calculateProgress();
  const unlockedCount = FEATURED_ITEMS.filter(i => findItem(i.id)).length + THEMES.filter(t => findItem(t.id, t.name)).length;
  const totalCount = FEATURED_ITEMS.length + THEMES.length;

  return (
    <div className="min-h-full bg-gradient-to-b from-white/50 to-transparent pb-36">
      
      {/* Hero Header Stats */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-2 bg-gradient-to-b from-[#fff0f5] via-[#fff0f5]/95 to-transparent">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -right-6 -top-6 text-yellow-100 opacity-50 rotate-12">
                <Trophy size={120} fill="currentColor" />
            </div>

            <div className="relative z-10 flex justify-between items-end mb-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <BookOpen size={20} className="text-pink-500" />
                        收藏进度
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                        已收集 <span className="text-pink-500 font-bold text-sm">{unlockedCount}</span> / {totalCount} 款梦幻单品
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-['Zcool_KuaiLe'] text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-500 drop-shadow-sm">
                        {progress}<span className="text-lg font-sans ml-1 text-pink-400">%</span>
                    </div>
                </div>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100 relative">
                <div 
                    className="h-full bg-gradient-to-r from-pink-300 via-pink-400 to-purple-400 relative transition-all duration-1000 ease-out flex items-center justify-end pr-0.5"
                    style={{ width: `${progress}%` }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-white/20 animate-[shine_2s_infinite] skew-x-12"></div>
                    {/* End Dot */}
                    <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm opacity-80"></div>
                </div>
            </div>
        </div>
      </div>

      <div className="px-5 space-y-10 mt-4">
        {/* Section 1: Featured Items (Portrait Cards) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                    <span className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600">
                        <Crown size={18} fill="currentColor" />
                    </span>
                    限定珍藏系列
                </h3>
                <span className="text-xs font-bold bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full border border-yellow-100">
                    {FEATURED_ITEMS.filter(i => findItem(i.id)).length}/{FEATURED_ITEMS.length}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {FEATURED_ITEMS.map((feat) => {
                    const ownedItem = findItem(feat.id);
                    return (
                        <div key={feat.id} className="relative group perspective-1000">
                            <div className={`
                                relative rounded-2xl overflow-hidden aspect-[3/4] transition-all duration-500
                                ${ownedItem 
                                    ? 'bg-white shadow-[0_10px_20px_-5px_rgba(255,182,193,0.4)] border-4 border-white rotate-0 hover:rotate-1 hover:scale-[1.02]' 
                                    : 'bg-pink-50 border-2 border-dashed border-pink-200 shadow-inner'}
                            `}>
                            
                                {ownedItem ? (
                                    <>
                                        <div className="w-full h-full relative z-0 bg-gray-50">
                                            <img src={ownedItem.imageUrl} alt={feat.nameSuffix} className="w-full h-full object-cover" />
                                            {/* Glossy Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none"></div>
                                        </div>
                                        
                                        {/* Bottom Label */}
                                        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-2 text-center border-t border-pink-50">
                                            <p className="text-xs font-bold text-gray-800 line-clamp-1">{feat.nameSuffix}</p>
                                        </div>
                                        
                                        {/* Collected Stamp */}
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-yellow-200 transform rotate-6 z-10">
                                            GET!
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-pink-300 p-4 text-center relative overflow-hidden">
                                        {/* Background Pattern for Locked */}
                                        <div className="absolute inset-0 opacity-10" 
                                             style={{backgroundImage: 'radial-gradient(#ff69b4 2px, transparent 2px)', backgroundSize: '16px 16px'}}>
                                        </div>
                                        
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 z-10">
                                            <Lock size={20} className="text-pink-300" />
                                        </div>
                                        <p className="text-xs font-bold z-10 bg-white/60 px-2 py-0.5 rounded-full">???</p>
                                        <p className="text-[10px] mt-2 opacity-60 line-clamp-1 z-10">{feat.nameSuffix}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Section 2: Themes (Square Grid) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-bold text-gray-800 text-lg">
                     <span className="bg-pink-100 p-1.5 rounded-lg text-pink-500">
                        <Sparkles size={18} fill="currentColor" />
                    </span>
                    梦幻主题系列
                </h3>
                <span className="text-xs font-bold bg-pink-50 text-pink-500 px-2 py-1 rounded-full border border-pink-100">
                    {THEMES.filter(t => findItem(t.id, t.name)).length}/{THEMES.length}
                </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {THEMES.map((theme) => {
                    const ownedItem = findItem(theme.id, theme.name);
                    return (
                        <div key={theme.id} className={`
                            relative rounded-xl overflow-hidden aspect-square transition-all duration-300
                            ${ownedItem 
                                ? 'bg-white shadow-md border border-pink-100' 
                                : 'bg-gray-50 border border-gray-100 opacity-80'}
                        `}>
                            
                            {ownedItem ? (
                                <>
                                    <img src={ownedItem.imageUrl} alt={theme.name} className="w-full h-full object-cover" />
                                    {/* Gradient Label */}
                                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent">
                                        <p className="text-[10px] font-bold text-white pb-1.5 text-shadow-sm tracking-wide">{theme.name}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300 relative">
                                    <div className="absolute inset-2 border-2 border-dashed border-gray-200 rounded-lg"></div>
                                    <span className="text-[10px] font-medium mb-1 z-10 text-gray-400">{theme.name}</span>
                                    <Lock size={14} className="opacity-50" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Footer Note */}
        <div className="text-center pb-8 pt-4">
            <p className="text-[10px] text-gray-300 flex items-center justify-center gap-1">
                <Star size={10} /> 
                集齐所有款式召唤神秘魔法 
                <Star size={10} />
            </p>
        </div>
      </div>
    </div>
  );
};