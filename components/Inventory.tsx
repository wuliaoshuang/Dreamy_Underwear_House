import React, { useState } from 'react';
import { GachaItem, RarityColors, RECYCLE_VALUES, Rarity } from '../types';
import { Card } from './Card';
import { Heart, PackageOpen, X, Coins, Sparkles, Trash2 } from 'lucide-react';
import { Button } from './Button';

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
        // Confirmation is implicit in the secondary action, making it snappy
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
          <Card key={item.id} item={item} onClick={() => setSelectedItem(item)} />
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
             
             <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[pop-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col max-h-[85dvh]">
                {/* Header */}
                <div className={`${RarityColors[selectedItem.rarity].bg} p-4 flex justify-between items-center border-b border-black/5 shrink-0`}>
                     <div className="flex flex-col">
                        <span className={`text-xs font-bold ${RarityColors[selectedItem.rarity].text}`}>{selectedItem.rarity}</span>
                        <h3 className="text-lg font-bold text-gray-800">{selectedItem.name}</h3>
                     </div>
                     <button onClick={() => setSelectedItem(null)} className="bg-white/50 p-2 rounded-full hover:bg-white transition-colors">
                         <X size={20} className="text-gray-500" />
                     </button>
                </div>

                {/* Image Scrollable Area */}
                <div className="overflow-y-auto flex-1 p-4 bg-gray-50">
                    <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md mb-4 relative min-h-[200px] bg-white">
                        {selectedItem.rarity === Rarity.LEGENDARY && <div className="absolute inset-0 z-10 holo-effect opacity-30 pointer-events-none mix-blend-overlay"></div>}
                        <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-auto object-cover" />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Sparkles size={14} className="text-pink-400" /> 物品描述
                        </h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{selectedItem.description}</p>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
                    <button 
                        onClick={handleSell}
                        className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1 border border-red-100"
                    >
                        <Trash2 size={18} />
                        <span className="flex flex-col items-start leading-none text-xs">
                             <span className="text-[10px] opacity-70">化为星尘</span>
                             <span className="text-sm">+{RECYCLE_VALUES[selectedItem.rarity]} 币</span>
                        </span>
                    </button>
                    
                    <Button onClick={() => setSelectedItem(null)} className="flex-[2]">
                        太可爱了，留下！
                    </Button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};