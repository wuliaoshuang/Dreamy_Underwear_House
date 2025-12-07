import { GoogleGenAI } from "@google/genai";
import { Rarity, GachaItem } from "../types";
import { 
  THEMES, STYLES, TYPES, FABRICS, DETAILS, FEELINGS, SCENTS, OWNERS, FEATURED_ITEMS 
} from "../data/gameData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

// Generate magic value based on rarity
function generateMagicValue(rarity: Rarity): number {
  switch (rarity) {
    case Rarity.COMMON: return Math.floor(Math.random() * 50) + 10;
    case Rarity.RARE: return Math.floor(Math.random() * 150) + 60;
    case Rarity.EPIC: return Math.floor(Math.random() * 400) + 250;
    case Rarity.LEGENDARY: return Math.floor(Math.random() * 1000) + 888;
    default: return 0;
  }
}

export const generateGachaItem = async (rarity: Rarity): Promise<Omit<GachaItem, 'id' | 'timestamp'>> => {
  // New props generation
  const scent = getRandomElement(SCENTS);
  const owner = getRandomElement(OWNERS);
  const magicValue = generateMagicValue(rarity);

  // Decision: Use a Featured Item from the video?
  // LOGIC UPDATE: Featured items are now EXCLUSIVE to high rarities to maintain value.
  let useFeatured = false;

  if (rarity === Rarity.LEGENDARY) {
      // 70% chance to get a Featured item if you hit Legendary
      useFeatured = Math.random() < 0.7; 
  } else if (rarity === Rarity.EPIC) {
      // 40% chance to get a Featured item if you hit Epic
      useFeatured = Math.random() < 0.4;
  } else {
      // Common and Rare can NEVER be featured items
      useFeatured = false;
  }
  
  let prompt = "";
  let generatedName = "";
  let description = "";
  let collectionId = "";

  if (useFeatured) {
    // --- FEATURED ITEM PATH ---
    const featured = getRandomElement(FEATURED_ITEMS);
    collectionId = featured.id;
    
    // Add rarity specific flavor to the preset prompt
    let rarityPrompt = "";
    let namePrefix = "";
    switch (rarity) {
        // Common/Rare cases technically unreachable now due to logic above, but kept for safety
        case Rarity.COMMON: rarityPrompt = "simple, everyday comfortable style"; namePrefix = "日常"; break;
        case Rarity.RARE: rarityPrompt = "high quality, detailed fabric, soft lighting"; namePrefix = "甜心"; break;
        case Rarity.EPIC: rarityPrompt = "magical aura, glowing, intricate details, masterpiece, high contrast"; namePrefix = "魔法"; break;
        case Rarity.LEGENDARY: rarityPrompt = "divine, cinematic lighting, sparkling jewels, angel feathers, ethereal, 8k resolution, highly detailed background"; namePrefix = "梦幻"; break;
    }

    prompt = `
      Draw a single panties/underwear.
      View: Flat lay product shot or hanging display (clothing only, NO characters, NO bodies).
      Art Style: High-quality cute anime art, soft pastel colors.
      Design Base: ${featured.prompt}.
      Rarity Level/Atmosphere: ${rarityPrompt}.
      Background: Soft dreamy abstract background suitable for a game card.
      Do not include any text in the image.
    `;

    generatedName = `${namePrefix}·${featured.nameSuffix}`;
    description = `${featured.descBase} 这款${namePrefix}级别的限定单品散发着${scent}，具有极高的收藏价值。`;

  } else {
    // --- RANDOM GENERATION PATH ---
    const themeObj = getRandomElement(THEMES);
    const theme = themeObj.label;
    collectionId = themeObj.id;

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

    prompt = `
      Draw a single ${type.en}.
      View: Flat lay product shot or hanging display (clothing only, NO characters, NO bodies).
      Art Style: High-quality cute anime art, soft pastel colors (pink, white, blue, lavender).
      Theme: ${theme}.
      Material/Style: ${style}.
      Rarity Level Details: ${promptDetails}.
      Background: Soft dreamy abstract background suitable for a game card.
      Do not include any text in the image.
    `;

    generatedName = `${namePrefix}·${themeObj.name}${type.name}`;
    description = `这是一款${namePrefix}级别的${themeObj.name}主题${type.name}。主体选用了${fabric}，${detail}。${feeling}`;
  }

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

    return {
      imageUrl,
      name: generatedName,
      description,
      scent,
      owner,
      magicValue,
      rarity,
      collectionId
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback in case of error
    return {
      imageUrl: `https://picsum.photos/300/400?random=${Date.now()}`,
      name: "未知错误物品",
      description: "AI 似乎在编织梦境时打了个盹，请稍后再试...",
      scent: "未知",
      owner: "未知",
      magicValue: 0,
      rarity,
      collectionId: 'unknown'
    };
  }
};