import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { GachaItem, RarityColors, RECYCLE_VALUES, Rarity } from '../types';
import { Card } from './Card';
import { Heart, PackageOpen, X, Trash2, Flower, User, Zap, Filter } from 'lucide-react';
import { Button } from './Button';
import { HapticsService } from '../services/hapticsService';

interface InventoryProps {
  items: GachaItem[];
  onSellItem: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onSellItem }) => {
  const [selectedItem, setSelectedItem] = useState<GachaItem | null>(null);
  const [filter, setFilter] = useState<Rarity | 'ALL'>('ALL');

  // Calculate stats
  const totalMagic = useMemo(() => items.reduce((acc, item) => acc + (item.magicValue || 0), 0), [items]);
  
  // Filter and Sort Logic
  const filteredItems = useMemo(() => {
    let result = items;
    
    // 1. Filter
    if (filter !== 'ALL') {
        result = items.filter(i => i.rarity === filter);
    }
    
    // 2. Sort: Legendary -> Common, then Newest -> Oldest
    return result.sort((a, b) => {
        const rarityOrder = {
          [Rarity.LEGENDARY]: 4,
          [Rarity.EPIC]: 3,
          [Rarity.RARE]: 2,
          [Rarity.COMMON]: 1
        };
        const diff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
        if (diff !== 0) return diff;
        return b.timestamp - a.timestamp;
    });
  }, [items, filter]);

  const handleSell = () => {
    if (selectedItem) {
        HapticsService.heavy(); // 删除卡片时的重度反馈
        onSellItem(selectedItem.id);
        setSelectedItem(null);
    }
  };

  // Helper component for filter buttons
  const FilterChip = ({ label, value, colorClass }: { label: string, value: Rarity | 'ALL', colorClass: string }) => (
      <button 
        onClick={() => setFilter(value)}
        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border shrink-0
            ${filter === value 
                ? `${colorClass} ring-2 ring-offset-1 ring-white shadow-md scale-105` 
                : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50 hover:text-gray-500'}`}
      >
        {label}
      </button>
  );

  return (
    <div className="min-h-full bg-gradient-to-b from-[#fff0f5] to-white pb-36">
      
      {/* Sticky Header Dashboard */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-2 bg-gradient-to-b from-[#fff0f5] via-[#fff0f5]/95 to-transparent">
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
             
             {/* Top Row: Title & Stats */}
             <div className="flex justify-between items-center mb-4 relative z-10">
                 <div>
                     <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <div className="bg-pink-100 p-1.5 rounded-lg shadow-sm">
                            <Heart className="text-pink-500 fill-pink-500" size={16} />
                        </div>
                        我的珍藏馆
                     </h2>
                     <p className="text-xs text-gray-400 mt-1 pl-1">
                         已收集 <span className="text-pink-500 font-bold">{items.length}</span> 件梦幻单品
                     </p>
                 </div>

                 <div className="flex flex-col items-end">
                     <div className="flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 shadow-sm">
                         <Zap size={12} className="text-purple-500 fill-purple-500" />
                         <span className="text-xs font-bold text-purple-600">{totalMagic}</span>
                     </div>
                     <span className="text-[9px] text-gray-300 mt-1 mr-1">总魔力值</span>
                 </div>
             </div>

             {/* Bottom Row: Filters */}
             <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                <FilterChip label="全部" value="ALL" colorClass="bg-gray-700 text-white border-gray-700" />
                <FilterChip label="至臻" value={Rarity.LEGENDARY} colorClass="bg-yellow-100 text-yellow-700 border-yellow-200" />
                <FilterChip label="无敌" value={Rarity.EPIC} colorClass="bg-purple-100 text-purple-700 border-purple-200" />
                <FilterChip label="超级" value={Rarity.RARE} colorClass="bg-pink-100 text-pink-700 border-pink-200" />
                <FilterChip label="普通" value={Rarity.COMMON} colorClass="bg-blue-100 text-blue-700 border-blue-200" />
             </div>
         </div>
      </div>
      
      {/* Grid Content */}
      <div className="px-4 mt-2">
        {items.length === 0 ? (
            // Totally Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-80">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm animate-pulse border-4 border-pink-50">
                    <PackageOpen size={40} className="text-pink-300" />
                </div>
                <h3 className="text-lg font-bold text-pink-400 mb-1">空空如也</h3>
                <p className="text-xs text-pink-300">衣橱里还没有衣服哦<br/>快去扭蛋机试试手气吧！</p>
            </div>
        ) : filteredItems.length === 0 ? (
            // Filter Result Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Filter size={32} className="text-gray-300" />
                 </div>
                 <p className="text-sm text-gray-400 font-medium">没有找到这个等级的衣服</p>
                 <button onClick={() => setFilter('ALL')} className="mt-2 text-xs text-pink-400 underline">
                     显示全部
                 </button>
            </div>
        ) : (
            // Grid
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 animate-[pop-in_0.4s_ease-out]">
                {filteredItems.map((item) => (
                <Card key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                ))}
            </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
             
             <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-[pop-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className={`${RarityColors[selectedItem.rarity].bg} px-5 py-4 flex justify-between items-center border-b border-black/5 shrink-0`}>
                     <div className="flex flex-col">
                        <span className={`text-[10px] font-bold ${RarityColors[selectedItem.rarity].text} uppercase tracking-wider mb-0.5`}>{selectedItem.rarity}</span>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{selectedItem.name}</h3>
                     </div>
                     <button onClick={() => setSelectedItem(null)} className="bg-white/60 p-1.5 rounded-full hover:bg-white transition-colors">
                         <X size={20} className="text-gray-500" />
                     </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 bg-gray-50 overflow-y-auto scrollbar-hide">
                    {/* Compact Image */}
                    <div className="rounded-2xl overflow-hidden border-4 border-white shadow-md mb-5 relative bg-white mx-auto w-3/4 sm:w-2/3 rotate-1">
                        {selectedItem.rarity === Rarity.LEGENDARY && <div className="absolute inset-0 z-10 holo-effect opacity-30 pointer-events-none mix-blend-overlay"></div>}
                        <img 
                          src={selectedItem.imageUrl} 
                          alt={selectedItem.name} 
                          className="w-full h-48 sm:h-56 object-cover" 
                        />
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-white p-2.5 rounded-2xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                            <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><User size={10} /> 所有者</span>
                            <span className="text-xs font-bold text-pink-500 line-clamp-1">{selectedItem.owner || '??'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-2xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                            <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><Flower size={10} /> 气味</span>
                            <span className="text-xs font-bold text-pink-500 line-clamp-1">{selectedItem.scent || '未知'}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-2xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                            <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1"><Zap size={10} /> 魔力</span>
                            <span className="text-xs font-bold text-purple-500">{selectedItem.magicValue || 0}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
                        <div className="absolute top-0 left-4 -translate-y-1/2 bg-gray-100 text-gray-400 text-[9px] px-2 py-0.5 rounded-full font-bold">STORY</div>
                        <p className="text-gray-500 text-sm leading-relaxed mt-1 text-justify">{selectedItem.description}</p>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0">
                    <button 
                        onClick={handleSell}
                        className="flex-1 bg-red-50 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100 group active:scale-95"
                    >
                        <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="flex flex-col items-start leading-none gap-0.5">
                             <span className="text-[9px] opacity-70">回收</span>
                             <span className="text-sm font-bold">+{RECYCLE_VALUES[selectedItem.rarity]}</span>
                        </span>
                    </button>
                    
                    <Button onClick={() => setSelectedItem(null)} className="flex-[2] py-3 text-sm rounded-2xl shadow-lg shadow-pink-200">
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