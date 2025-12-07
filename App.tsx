import React, { useState, useEffect } from 'react';
import { GachaMachine } from './components/GachaMachine';
import { Inventory } from './components/Inventory';
import { GachaItem, GACHA_COST, RECYCLE_VALUES } from './types';
import { Grid, Gift, Cat, Cloud, Coins } from 'lucide-react';
import { HapticsService } from './services/hapticsService';

enum Tab {
  GACHA = 'gacha',
  INVENTORY = 'inventory'
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.GACHA);
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [currency, setCurrency] = useState<number>(1000); // Start with 1000 coins
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from LocalStorage on startup
  useEffect(() => {
    const savedInventory = localStorage.getItem('gacha_inventory');
    const savedCurrency = localStorage.getItem('gacha_currency');
    
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (e) {
        console.error("Failed to parse inventory", e);
      }
    }
    
    if (savedCurrency) {
      setCurrency(parseInt(savedCurrency, 10));
    }
    
    setIsLoaded(true);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gacha_inventory', JSON.stringify(inventory));
      localStorage.setItem('gacha_currency', currency.toString());
    }
  }, [inventory, currency, isLoaded]);

  const handleItemObtained = (item: GachaItem) => {
    setInventory(prev => [item, ...prev]);
    setCurrency(prev => Math.max(0, prev - GACHA_COST));
  };

  const handleSellItem = (id: string) => {
    const itemToSell = inventory.find(i => i.id === id);
    if (itemToSell) {
      HapticsService.medium(); // 出售时触发中等反馈
      const value = RECYCLE_VALUES[itemToSell.rarity];
      setInventory(prev => prev.filter(i => i.id !== id));
      setCurrency(prev => prev + value);
    }
  };

  const handleAddCoins = (amount: number) => {
    setCurrency(prev => prev + amount);
  };

  if (!isLoaded) return null; // Prevent flash of empty state

  return (
    <div className="h-[100dvh] w-full md:max-w-md md:mx-auto bg-[#fff0f5] shadow-2xl overflow-hidden flex flex-col relative font-fredoka">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute -top-10 -left-10 text-white/40 animate-[float_6s_ease-in-out_infinite]"><Cloud size={120} fill="white" /></div>
         <div className="absolute top-40 -right-20 text-white/40 animate-[float_8s_ease-in-out_infinite_1s]"><Cloud size={100} fill="white" /></div>
         <div className="absolute bottom-40 -left-10 text-white/30 animate-[float_7s_ease-in-out_infinite_2s]"><Cloud size={80} fill="white" /></div>
      </div>

      {/* Header */}
      <header className="px-5 py-3 shrink-0 flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-white shadow-sm transition-all safe-top-padding">
        <div className="flex items-center gap-2">
           <div className="bg-pink-400 p-1.5 rounded-lg rotate-3 shadow-md">
             <Cat className="text-white w-5 h-5" />
           </div>
           <h1 className="font-bold text-lg text-gray-700 tracking-wide">梦幻内衣屋</h1>
        </div>
        
        <div className="flex gap-2">
            {/* Currency Badge */}
            <div className="bg-yellow-100 px-3 py-1 rounded-full text-xs font-bold text-yellow-700 border border-yellow-300 shadow-inner flex items-center gap-1">
              <Coins size={14} className="fill-yellow-400 text-yellow-600" />
              {currency}
            </div>
            {/* Collection Count */}
            <div className="bg-pink-100 px-3 py-1 rounded-full text-xs font-bold text-pink-600 border border-pink-200 shadow-inner">
              已收集: {inventory.length}
            </div>
        </div>
      </header>

      {/* Main Content - Scrollable Area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide relative z-10 overscroll-contain">
        {currentTab === Tab.GACHA ? (
          <GachaMachine 
            onItemObtained={handleItemObtained} 
            currency={currency}
            onAddCoins={handleAddCoins}
          />
        ) : (
          <Inventory 
            items={inventory} 
            onSellItem={handleSellItem}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none safe-bottom-padding">
        <nav className="bg-white/95 backdrop-blur-xl border border-pink-100 p-1.5 rounded-full shadow-2xl flex items-center gap-1 pointer-events-auto w-[85%] max-w-xs justify-between">
          <button 
            onClick={() => {
              HapticsService.light();
              setCurrentTab(Tab.GACHA);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 active:scale-95
              ${currentTab === Tab.GACHA 
                ? 'bg-pink-400 text-white shadow-lg shadow-pink-300/50' 
                : 'text-gray-400 hover:text-pink-400 hover:bg-pink-50'}`}
          >
            <Gift size={20} className={currentTab === Tab.GACHA ? 'animate-[spin-slow_3s_linear_infinite]' : ''} />
            <span className="font-bold text-sm">扭蛋机</span>
          </button>

          <button 
            onClick={() => {
              HapticsService.light();
              setCurrentTab(Tab.INVENTORY);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 active:scale-95
              ${currentTab === Tab.INVENTORY 
                ? 'bg-pink-400 text-white shadow-lg shadow-pink-300/50' 
                : 'text-gray-400 hover:text-pink-400 hover:bg-pink-50'}`}
          >
            <Grid size={20} />
            <span className="font-bold text-sm">收藏夹</span>
          </button>
        </nav>
      </div>
      
    </div>
  );
};

export default App;