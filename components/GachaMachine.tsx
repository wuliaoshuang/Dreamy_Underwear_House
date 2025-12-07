import React, { useState, useMemo } from 'react';
import { Rarity, GachaItem, GACHA_COST } from '../types';
import { generateGachaItem } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, ArrowLeft, PlusCircle, Coins } from 'lucide-react';

interface GachaMachineProps {
  onItemObtained: (item: GachaItem) => void;
  currency: number;
  onAddCoins: (amount: number) => void;
}

// Generate random visual props for the balls inside the machine
const generateMachineBalls = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    // Use gradients for more 3D look
    colorClass: [
        'bg-gradient-to-br from-pink-300 to-pink-500', 
        'bg-gradient-to-br from-blue-200 to-blue-400', 
        'bg-gradient-to-br from-purple-300 to-purple-500', 
        'bg-gradient-to-br from-yellow-200 to-yellow-400',
        'bg-gradient-to-br from-green-200 to-green-400'
    ][Math.floor(Math.random() * 5)],
    left: `${Math.random() * 60 + 20}%`,
    top: `${Math.random() * 50 + 30}%`, // Keep them mostly at bottom initially
    rotate: `${Math.random() * 360}deg`,
    size: Math.random() * 8 + 28, // Slightly smaller range for mobile safety
    zIndex: Math.floor(Math.random() * 20),
    mixType: Math.floor(Math.random() * 3) + 1 
  }));
};

export const GachaMachine: React.FC<GachaMachineProps> = ({ onItemObtained, currency, onAddCoins }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [animationStage, setAnimationStage] = useState<'idle' | 'cranking' | 'dropping'>('idle');
  const [lastPull, setLastPull] = useState<GachaItem | null>(null);
  const [isDailyClaimed, setIsDailyClaimed] = useState(false);

  // Memoize the balls
  const machineBalls = useMemo(() => generateMachineBalls(22), []);

  // Gacha Probabilities
  const determineRarity = (): Rarity => {
    const roll = Math.random() * 100;
    if (roll < 5) return Rarity.LEGENDARY; // 5%
    if (roll < 20) return Rarity.EPIC;      // 15%
    if (roll < 50) return Rarity.RARE;      // 30%
    return Rarity.COMMON;                   // 50%
  };

  const handlePull = async () => {
    if (isPulling) return;
    if (currency < GACHA_COST) {
      alert("星光币不足哦！快去把不喜欢的卡片变成星尘，或者领取每日补给吧！");
      return;
    }
    
    setIsPulling(true);
    setAnimationStage('cranking');
    setLastPull(null);

    // Start API request in parallel with animation
    const rarity = determineRarity();
    const generationPromise = generateGachaItem(rarity);

    // Animation Sequence
    try {
      // Phase 1: Cranking & Mixing (1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Phase 2: Ball Dropping (0.8s)
      setAnimationStage('dropping');
      await new Promise(resolve => setTimeout(resolve, 800)); 

      // Phase 3: Reveal
      // Await generation if it hasn't finished yet
      const generated = await generationPromise;
      
      const newItem: GachaItem = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        rarity,
        ...generated,
        timestamp: Date.now()
      };

      setLastPull(newItem);
      onItemObtained(newItem);
    } catch (e) {
      console.error(e);
      alert("AI 好像睡着了，请稍后再试！(不扣费)");
    } finally {
      setIsPulling(false);
      setAnimationStage('idle');
    }
  };

  const handleDailyBonus = () => {
    if (!isDailyClaimed) {
      onAddCoins(500);
      setIsDailyClaimed(true);
      alert("领取成功！获得了 500 星光币！");
    }
  };

  const resetPull = () => {
    setLastPull(null);
  };

  // The Result Overlay
  if (lastPull) {
    const isLegendary = lastPull.rarity === Rarity.LEGENDARY;
    const isEpic = lastPull.rarity === Rarity.EPIC;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop with Blur */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={resetPull}></div>
        
        {/* Sunburst for High Rarity */}
        {(isLegendary || isEpic) && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
             <div className="w-[200vw] h-[200vw] sunburst opacity-30 bg-gradient-to-r from-yellow-100/20 to-transparent"></div>
           </div>
        )}

        {/* Card Reveal Container */}
        <div className="relative w-full max-w-sm flex flex-col items-center animate-[pop-in_0.6s_cubic-bezier(0.34,1.56,0.64,1)] max-h-[90dvh] overflow-y-auto scrollbar-hide">
            
            {/* Title Badge */}
            <div className="mb-6 relative z-10 shrink-0">
                <div className={`px-8 py-2 rounded-full shadow-lg text-lg font-bold border-4 tracking-widest uppercase transform rotate-1
                  ${isLegendary ? 'bg-yellow-400 border-yellow-200 text-yellow-900 shadow-yellow-500/50' : 
                    isEpic ? 'bg-purple-400 border-purple-200 text-white shadow-purple-500/50' : 
                    lastPull.rarity === Rarity.RARE ? 'bg-pink-400 border-pink-200 text-white shadow-pink-500/50' : 
                    'bg-blue-400 border-blue-200 text-white shadow-blue-500/50'}`}>
                  {lastPull.rarity}
                </div>
            </div>

            {/* The Card */}
            <div className={`relative p-3 rounded-3xl bg-white shadow-2xl -rotate-1 shrink-0
                ${isLegendary ? 'shadow-yellow-500/40' : isEpic ? 'shadow-purple-500/40' : 'shadow-black/20'}`}>
                
                {/* Holo Overlay for legendary */}
                {isLegendary && <div className="absolute inset-0 rounded-3xl z-20 holo-effect pointer-events-none mix-blend-overlay opacity-50"></div>}
                
                <div className="rounded-2xl overflow-hidden border-2 border-gray-100 relative bg-gray-50">
                    <img src={lastPull.imageUrl} alt={lastPull.name} className="w-full h-auto object-cover aspect-[3/4] min-w-[240px] max-w-[280px]" />
                </div>
                
                <div className="p-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{lastPull.name}</h2>
                    <p className="text-sm text-gray-500">{lastPull.description}</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 z-10 w-full px-8 pb-8 shrink-0">
                <Button onClick={handlePull} isLoading={isPulling} disabled={currency < GACHA_COST} className="shadow-xl shadow-pink-500/30 w-full">
                   <span className="flex items-center gap-1">
                     再抽一次 <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Coins size={10} /> {GACHA_COST}</span>
                   </span>
                </Button>
                <Button onClick={resetPull} variant="secondary" className="bg-white/90 backdrop-blur w-full">
                  <ArrowLeft size={18} /> 返回
                </Button>
            </div>
        </div>
      </div>
    );
  }

  // The Machine Interface
  return (
    <div className="flex flex-col items-center justify-center py-6 relative w-full pb-36 min-h-full">
      
      {/* Visual Machine */}
      <div 
        className={`relative group cursor-pointer transform transition-transform duration-200 scale-95 sm:scale-100 ${animationStage === 'cranking' ? 'animate-[shake-hard_0.4s_ease-in-out_infinite]' : ''}`} 
        onClick={handlePull}
      >
        {/* Top Dome Container */}
        {/* Responsive width/height */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full relative z-10 flex items-center justify-center">
            
           {/* Glass Background (Back of dome) */}
           <div className="absolute inset-0 rounded-full bg-pink-100/50 border-4 border-white/80 shadow-inner"></div>

           {/* Balls Container */}
           <div className="absolute inset-2 rounded-full overflow-hidden z-10 mask-image: radial-gradient(circle, white 100%, black 100%)">
             {/* The Balls */}
             {machineBalls.map((ball) => (
                <div 
                    key={ball.id}
                    className={`absolute rounded-full border-2 border-white/40 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.1)] ${ball.colorClass}
                        ${animationStage === 'cranking' && ball.mixType === 1 ? 'animate-[mix-1_0.6s_linear_infinite]' : ''}
                        ${animationStage === 'cranking' && ball.mixType === 2 ? 'animate-[mix-2_0.7s_linear_infinite]' : ''}
                        ${animationStage === 'cranking' && ball.mixType === 3 ? 'animate-[mix-3_0.5s_linear_infinite]' : ''}
                    `}
                    style={{
                        left: ball.left,
                        top: ball.top,
                        width: `${ball.size}px`,
                        height: `${ball.size}px`,
                        transform: `rotate(${ball.rotate})`,
                        zIndex: ball.zIndex,
                        transition: animationStage === 'idle' ? 'transform 0.5s ease-out, top 0.5s ease-out' : 'none'
                    }}
                >
                    {/* Highlight on ball */}
                    <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-white/70 rounded-full blur-[1px]"></div>
                    <div className="absolute w-[110%] h-[2px] bg-black/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
             ))}
           </div>
           
           {/* Dropping Ball (Hidden unless dropping) */}
           {animationStage === 'dropping' && (
             <div className="absolute z-20 w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full border-4 border-white shadow-xl animate-[drop-bounce_0.8s_cubic-bezier(0.25, 1, 0.5, 1)_forwards] left-[calc(50%-1.75rem)]">
                 <div className="absolute w-full h-1 bg-black/10 top-1/2 -translate-y-1/2"></div>
                 <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
             </div>
           )}

           {/* Glass Highlights (Front of dome) */}
           <div className="absolute inset-0 rounded-full border-4 border-white/60 pointer-events-none z-30 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
               <div className="absolute top-6 right-10 w-16 h-8 bg-gradient-to-b from-white/60 to-transparent rounded-full rotate-[-30deg] blur-[1px]"></div>
               <div className="absolute bottom-6 left-10 w-10 h-5 bg-gradient-to-t from-white/40 to-transparent rounded-full rotate-[-30deg] blur-[1px]"></div>
           </div>
        </div>

        {/* Machine Base */}
        <div className="w-56 h-36 sm:w-64 sm:h-40 bg-pink-400 mx-auto -mt-16 rounded-b-[3rem] rounded-t-3xl relative shadow-xl z-0 border-b-8 border-pink-600 flex flex-col items-center pt-20">
            
            {/* Front Panel Details */}
            <div className="absolute top-16 left-4 right-4 h-1 bg-pink-500/50 rounded-full"></div>

            {/* Slot */}
            <div className="w-24 h-14 sm:w-28 sm:h-16 bg-pink-900/20 rounded-t-full rounded-b-3xl mb-1 border-4 border-pink-300/50 shadow-inner flex items-end justify-center overflow-hidden relative">
                 <div className="absolute top-0 w-full h-4 bg-black/20 blur-sm"></div>
                 {/* Ball appears in slot at end of drop */}
                 {animationStage === 'dropping' && (
                    <div className="w-10 h-10 rounded-full bg-pink-400 animate-bounce mb-1 shadow-lg"></div>
                 )}
            </div>
            
            {/* Crank/Handle */}
            <div className="absolute top-20 right-[-10px] transform translate-x-1/2">
                <div className={`w-4 h-16 bg-gray-300 rounded-full origin-top transform transition-transform duration-[1.5s] ease-in-out border-r-2 border-gray-400 ${animationStage === 'cranking' ? 'rotate-[720deg]' : 'rotate-[45deg]'}`}>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full shadow-lg border-2 border-pink-300"></div>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full border-4 border-pink-400 shadow-md absolute -top-2 -left-2"></div>
            </div>
            
             {/* Decorative Label */}
             <div className="absolute bottom-4 text-white/50 text-[10px] font-bold tracking-widest uppercase">
                 Dream Gacha
             </div>
        </div>
      </div>

      <div className="mt-4 text-center space-y-4 relative z-10 flex flex-col items-center w-full px-6">
        <h1 className="text-3xl font-extrabold text-pink-500 drop-shadow-sm tracking-wide font-['Zcool_KuaiLe']">
          梦幻扭蛋机
        </h1>
        
        <div className="flex flex-col gap-2 w-full max-w-[260px]">
            <Button 
                onClick={handlePull} 
                disabled={isPulling || currency < GACHA_COST} 
                isLoading={isPulling}
                className={`text-lg py-4 shadow-xl shadow-pink-300/40 w-full transition-all ${!isPulling ? 'hover:-translate-y-1' : ''}`}
            >
                <div className="flex flex-col items-center leading-none gap-1">
                   <div className="flex items-center gap-2">
                       <Sparkles size={18} className={isPulling ? 'animate-spin' : ''} /> 
                       {isPulling ? '正在制作惊喜...' : '投入魔法币'} 
                   </div>
                   {!isPulling && (
                       <span className="text-xs font-normal opacity-90 flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg mt-1">
                           消耗 <Coins size={10} /> {GACHA_COST}
                       </span>
                   )}
                </div>
            </Button>
            
            {currency < GACHA_COST && !isDailyClaimed && (
                 <button 
                   onClick={handleDailyBonus}
                   className="mt-2 w-full bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 py-3 rounded-2xl font-bold border-b-4 border-yellow-300 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 animate-[pulse_2s_infinite]"
                 >
                   <PlusCircle size={18} /> 
                   <span>领取每日补给 (+500币)</span>
                 </button>
            )}
            {currency < GACHA_COST && isDailyClaimed && (
                <p className="text-xs text-gray-400 mt-1">每日补给已领取，明天再来吧~</p>
            )}
        </div>
      </div>

      {/* Probability Legend */}
      <div className="mt-8 bg-white/60 backdrop-blur-md px-4 py-3 rounded-full flex flex-wrap justify-center gap-3 text-xs font-medium text-gray-500 border border-white shadow-sm max-w-[90%]">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></span>普通 50%</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-400 shadow-sm"></span>超级 30%</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-400 shadow-sm"></span>无敌 15%</div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm ring-2 ring-yellow-200"></span>至臻 5%</div>
      </div>
    </div>
  );
};