import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GachaItem, RarityColors, RECYCLE_VALUES, Rarity } from '../types';
import { Card } from './Card';
import { Heart, PackageOpen, X, Sparkles, Trash2, Flower, User, Zap } from 'lucide-react';
import { Button } from './Button';
import { HapticsService } from '../services/hapticsService';

interface InventoryProps {
  items: GachaItem[];
  onSellItem: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSellItem }) => {
  const [selectedItem, setSelectedItem] = useState<GachaItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-pink-300 p-8">
        <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <PackageOpen size={64} className="opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-pink-400 mb-2">空空如也</h3>
        <p className="text-sm text-pink-300/80">你的衣橱还没有收藏哦<br/>快去扭蛋机试试手气吧！</p>
      </div>
    );
  }

  // Sort by rarity (Legendary first) then date (Newest first)
  const sortedItems = [...items].sort((a, b) => {
    const rarityOrder = {
      '至臻可爱': 4,
      '无敌可爱': 3,
      '超级可爱': 2,
      '普通可爱': 1
    };
    const diff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
    if (diff !== 0) return diff;
    return b.timestamp - a.timestamp;
  });

  const handleSell = () => {
    if (selectedItem) {
        HapticsService.heavy(); // 删除卡片时的重度反馈
        onSellItem(selectedItem.id);
        setSelectedItem(null);
    }
  };

  return (
    <div className="p-4 pb-36">
      <div className="mb-6 px-2 sticky top-0 z-20 py-2 bg-pink-50/90 backdrop-blur-md -mx-4 border-b border-pink-100 shadow-sm">
         <div className="flex items-center justify-center gap-2 text-pink-600">
             <Heart className="fill-pink-600" size={20} />
             <h2 className="text-xl font-bold">我的珍藏馆 ({items.length})</h2>
         </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {sortedItems.map((item) => (
          <Card 
            key={item.id} 
            item={item} 
            onClick={() => {
              HapticsService.light(); // 点击卡片时的轻微反馈
              setSelectedItem(item);
            }} 
          />
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
             
             <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[pop-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col">
                {/* Header */}
                <div className={`${RarityColors[selectedItem.rarity].bg} px-4 py-3 flex justify-between items-center border-b border-black/5 shrink-0`}>
                     <div className="flex flex-col">
                        <span className={`text-[10px] font-bold ${RarityColors[selectedItem.rarity].text} uppercase tracking-wider`}>{selectedItem.rarity}</span>
                        <h3 className="text-base font-bold text-gray-800 line-clamp-1">{selectedItem.name}</h3>
                     </div>
                     <button onClick={() => {
                       HapticsService.light();
                       setSelectedItem(null);
                     }} className="bg-white/50 p-1.5 rounded-full hover:bg-white transition-colors">
                         <X size={18} className="text-gray-500" />
                     </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 bg-gray-50 overflow-y-auto max-h-[70vh]">
                    {/* Compact Image */}
                    <div className="rounded-xl overflow-hidden border-2 border-white shadow-md mb-4 relative bg-white mx-auto w-3/4 sm:w-2/3">
                        {selectedItem.rarity === Rarity.LEGENDARY && <div className="absolute inset-0 z-10 holo-effect opacity-30 pointer-events-none mix-blend-overlay"></div>}
                        <img 
                          src={selectedItem.imageUrl} 
                          alt={selectedItem.name} 
                          className="w-full h-40 sm:h-48 object-cover" 
                        />
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-white p-2 rounded-xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><User size={10} /> 所有者</span>
                            <span className="text-xs font-bold text-pink-500 line-clamp-1">{selectedItem.owner || '??'}</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Flower size={10} /> 气味</span>
                            <span className="text-xs font-bold text-pink-500 line-clamp-1">{selectedItem.scent || '未知'}</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <span className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Zap size={10} /> 魔力</span>
                            <span className="text-xs font-bold text-purple-500">{selectedItem.magicValue || 0}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-xs leading-relaxed">{selectedItem.description}</p>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                    <button 
                        onClick={handleSell}
                        className="flex-1 bg-red-50 text-red-500 font-bold py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1 border border-red-100"
                    >
                        <Trash2 size={16} />
                        <span className="flex flex-col items-start leading-none">
                             <span className="text-[9px] opacity-70">化为星尘</span>
                             <span className="text-xs font-bold">+{RECYCLE_VALUES[selectedItem.rarity]}</span>
                        </span>
                    </button>
                    
                    <Button onClick={() => setSelectedItem(null)} className="flex-[2] py-2 text-sm rounded-xl">
                        太可爱了，留下！
                    </Button>
                </div>
             </div>
        </div>,
        document.body
      )}
    </div>
  );
};