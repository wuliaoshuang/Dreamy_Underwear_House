import React, { useState, useEffect, useRef } from 'react';
import { GachaMachine } from './components/GachaMachine';
import { Inventory } from './components/Inventory';
import { CollectionBook } from './components/CollectionBook';
import { GachaItem, GACHA_COST, RECYCLE_VALUES } from './types';
import { Grid, Gift, Cat, Cloud, Coins, Book } from 'lucide-react';
import { db } from './utils/db';

enum Tab {
  GACHA = 'gacha',
  INVENTORY = 'inventory',
  COLLECTION = 'collection'
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.GACHA);
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [currency, setCurrency] = useState<number>(1000); // Start with 1000 coins
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use a ref to prevent saving during the initial load phase
  const isInitialMount = useRef(true);

  // Load data from IndexedDB (with fallback migration from localStorage)
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Try to get data from IndexedDB
        const dbInventory = await db.get<GachaItem[]>('gacha_inventory');
        const dbCurrency = await db.get<number>('gacha_currency');

        // 2. If IndexedDB is empty, check localStorage (Migration path)
        if (!dbInventory && !dbCurrency) {
          const localInventory = localStorage.getItem('gacha_inventory');
          const localCurrency = localStorage.getItem('gacha_currency');

          if (localInventory) {
            const parsedInv = JSON.parse(localInventory);
            setInventory(parsedInv);
            // Migrate to DB immediately
            await db.set('gacha_inventory', parsedInv);
          }
          
          if (localCurrency) {
            const parsedCurr = parseInt(localCurrency, 10);
            setCurrency(parsedCurr);
            await db.set('gacha_currency', parsedCurr);
          }

        } else {
          // Normal load from DB
          if (dbInventory) setInventory(dbInventory);
          if (dbCurrency !== null && dbCurrency !== undefined) setCurrency(dbCurrency);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoaded(true);
        // Small delay to ensure we don't trigger the save effect immediately
        setTimeout(() => {
            isInitialMount.current = false;
        }, 100);
      }
    };

    loadData();
  }, []);

  // Save data to IndexedDB whenever it changes
  useEffect(() => {
    // Skip saving if we haven't finished loading or if it's the very first render
    if (!isLoaded || isInitialMount.current) return;

    const saveData = async () => {
      await db.set('gacha_inventory', inventory);
      await db.set('gacha_currency', currency);
    };

    // Debounce slightly to avoid slamming the DB
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [inventory, currency, isLoaded]);

  const handleItemObtained = (item: GachaItem) => {
    setInventory(prev => [item, ...prev]);
    setCurrency(prev => Math.max(0, prev - GACHA_COST));
  };

  const handleSellItem = (id: string) => {
    const itemToSell = inventory.find(i => i.id === id);
    if (itemToSell) {
      const value = RECYCLE_VALUES[itemToSell.rarity];
      setInventory(prev => prev.filter(i => i.id !== id));
      setCurrency(prev => prev + value);
    }
  };

  const handleAddCoins = (amount: number) => {
    setCurrency(prev => prev + amount);
  };

  // Prevent flash of empty state or default values
  if (!isLoaded) return null; 

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
        {currentTab === Tab.GACHA && (
          <GachaMachine 
            onItemObtained={handleItemObtained} 
            currency={currency}
            onAddCoins={handleAddCoins}
          />
        )}
        {currentTab === Tab.INVENTORY && (
          <Inventory 
            items={inventory} 
            onSellItem={handleSellItem}
          />
        )}
        {currentTab === Tab.COLLECTION && (
          <CollectionBook inventory={inventory} />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none safe-bottom-padding">
        <nav className="bg-white/95 backdrop-blur-xl border border-pink-100 p-1.5 rounded-full shadow-2xl flex items-center gap-1 pointer-events-auto w-[90%] max-w-sm justify-between">
          <button 
            onClick={() => setCurrentTab(Tab.GACHA)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-full transition-all duration-300 active:scale-95
              ${currentTab === Tab.GACHA 
                ? 'bg-pink-400 text-white shadow-lg shadow-pink-300/50' 
                : 'text-gray-400 hover:text-pink-400 hover:bg-pink-50'}`}
          >
            <Gift size={20} className={currentTab === Tab.GACHA ? 'animate-[spin-slow_3s_linear_infinite]' : ''} />
            <span className="font-bold text-[10px]">扭蛋机</span>
          </button>

          <button 
            onClick={() => setCurrentTab(Tab.COLLECTION)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-full transition-all duration-300 active:scale-95
              ${currentTab === Tab.COLLECTION 
                ? 'bg-pink-400 text-white shadow-lg shadow-pink-300/50' 
                : 'text-gray-400 hover:text-pink-400 hover:bg-pink-50'}`}
          >
            <Book size={20} />
            <span className="font-bold text-[10px]">图鉴</span>
          </button>

          <button 
            onClick={() => setCurrentTab(Tab.INVENTORY)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-full transition-all duration-300 active:scale-95
              ${currentTab === Tab.INVENTORY 
                ? 'bg-pink-400 text-white shadow-lg shadow-pink-300/50' 
                : 'text-gray-400 hover:text-pink-400 hover:bg-pink-50'}`}
          >
            <Grid size={20} />
            <span className="font-bold text-[10px]">收藏夹</span>
          </button>
        </nav>
      </div>
      
    </div>
  );
};

export default App;