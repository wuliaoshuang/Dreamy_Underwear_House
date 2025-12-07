import { GoogleGenAI } from "@google/genai";
import { Rarity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Vocabulary Lists for random generation
const THEMES = [
  "草莓 (Strawberry)", "小熊 (Teddy Bear)", "云朵 (Cloud)", "星星 (Star)", 
  "猫咪 (Kitty)", "花朵 (Flower)", "彩虹 (Rainbow)", "天使 (Angel)", 
  "糖果 (Candy)", "爱心 (Heart)", "独角兽 (Unicorn)", "樱桃 (Cherry)",
  "贝壳 (Seashell)", "羽毛 (Feather)", "水晶 (Crystal)", "蝴蝶 (Butterfly)"
];

const STYLES = [
  "柔软棉质 (Soft Cotton)", "丝绸 (Silk)", "蕾丝花边 (Lace frills)", 
  "蝴蝶结 (Ribbons)", "半透明纱 (Sheer fabric)", "波点 (Polka dots)",
  "荷叶边 (Ruffles)", "缎面 (Satin)"
];

const TYPES = [
  { name: "内裤", en: "panties/underwear", weight: 0.5 },
  { name: "文胸", en: "bra/lingerie top", weight: 0.3 },
  { name: "内衣套装", en: "matching lingerie set (bra and panties)", weight: 0.2 }
];

const FABRICS = [
  "云朵般柔软的精梳棉", "触感冰凉的真丝", "轻盈透气的薄纱", 
  "细腻亲肤的莫代尔", "高光泽感的色丁缎面", "富有弹性的蕾丝"
];

const DETAILS = [
  "点缀着精致的刺绣", "镶嵌着闪亮的小水钻", "搭配了甜美的蝴蝶结", 
  "边缘采用了波浪形剪裁", "印有可爱的专属图案", "有着层层叠叠的荷叶边",
  "系带设计增添了一丝俏皮"
];

const FEELINGS = [
  "穿上它仿佛置身于童话世界。", "是给肌肤的一封温柔情书。", 
  "心情也会变得粉嫩起来。", "充满了少女的奇思妙想。", 
  "舒适得让人不想脱下来。", "让你在梦中也能保持可爱。"
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedType() {
  const rand = Math.random();
  let cumulative = 0;
  for (const t of TYPES) {
    cumulative += t.weight;
    if (rand < cumulative) return t;
  }
  return TYPES[0];
}

export const generateGachaItem = async (rarity: Rarity): Promise<{ imageUrl: string, name: string, description: string }> => {
  const theme = getRandomElement(THEMES);
  const style = getRandomElement(STYLES);
  const type = getWeightedType();
  const fabric = getRandomElement(FABRICS);
  const detail = getRandomElement(DETAILS);
  const feeling = getRandomElement(FEELINGS);
  
  let promptDetails = "";
  let namePrefix = "";
  
  switch (rarity) {
    case Rarity.COMMON:
      promptDetails = "simple design, cute, comfortable, everyday wear, pastel colors";
      namePrefix = "日常";
      break;
    case Rarity.RARE:
      promptDetails = "frilly edges, small ribbons, cute pattern, pastel colors, soft texture, more detailed";
      namePrefix = "甜心";
      break;
    case Rarity.EPIC:
      promptDetails = "elaborate lace, big satin ribbons, glowing aura, intricate embroidery, magical girl vibe, high quality";
      namePrefix = "魔法";
      break;
    case Rarity.LEGENDARY:
      promptDetails = "masterpiece, divine aesthetic, jeweled accessories, angel wings motif, sparkling particles, glowing holy light, extreme detail, royal, cinematic lighting";
      namePrefix = "梦幻";
      break;
  }

  const prompt = `
    Draw a single ${type.en}.
    View: Flat lay product shot or hanging display (clothing only, NO characters, NO bodies).
    Art Style: High-quality cute anime art, soft pastel colors (pink, white, blue, lavender).
    Theme: ${theme}.
    Material/Style: ${style}.
    Rarity Level Details: ${promptDetails}.
    Background: Soft dreamy abstract background suitable for a game card.
    Do not include any text in the image.
  `;

  try {
    // 1. Generate the Image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Card shape
        }
      }
    });

    let imageUrl = "";
    
    // Parse response for image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
        throw new Error("Failed to generate image data.");
    }

    // Generate a rich name and description
    const themeName = theme.split('(')[0].trim();
    const styleName = style.split('(')[0].trim();
    
    const generatedName = `${namePrefix}·${themeName}${type.name}`;
    
    // Construct a rich description
    const description = `这是一款${namePrefix}级别的${themeName}主题${type.name}。主体选用了${fabric}，${detail}。整体风格呈现为${styleName}，${feeling}`;

    return {
      imageUrl,
      name: generatedName,
      description
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback in case of error
    return {
      imageUrl: `https://picsum.photos/300/400?random=${Date.now()}`,
      name: "未知错误物品",
      description: "AI 似乎在编织梦境时打了个盹，请稍后再试..."
    };
  }
};