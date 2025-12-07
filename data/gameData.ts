// Vocabulary Lists for random generation
export const THEMES = [
  { id: 'strawberry', name: "草莓", label: "草莓 (Strawberry)" },
  { id: 'bear', name: "小熊", label: "小熊 (Teddy Bear)" },
  { id: 'cloud', name: "云朵", label: "云朵 (Cloud)" },
  { id: 'star', name: "星星", label: "星星 (Star)" },
  { id: 'kitty', name: "猫咪", label: "猫咪 (Kitty)" },
  { id: 'flower', name: "花朵", label: "花朵 (Flower)" },
  { id: 'rainbow', name: "彩虹", label: "彩虹 (Rainbow)" },
  { id: 'angel', name: "天使", label: "天使 (Angel)" },
  { id: 'candy', name: "糖果", label: "糖果 (Candy)" },
  { id: 'heart', name: "爱心", label: "爱心 (Heart)" },
  { id: 'unicorn', name: "独角兽", label: "独角兽 (Unicorn)" },
  { id: 'cherry', name: "樱桃", label: "樱桃 (Cherry)" },
  { id: 'shell', name: "贝壳", label: "贝壳 (Seashell)" },
  { id: 'feather', name: "羽毛", label: "羽毛 (Feather)" },
  { id: 'crystal', name: "水晶", label: "水晶 (Crystal)" },
  { id: 'butterfly', name: "蝴蝶", label: "蝴蝶 (Butterfly)" },
  { id: 'maid', name: "女仆", label: "女仆 (Maid)" },
  { id: 'polka', name: "波点", label: "波点 (Polka Dot)" },
  { id: 'cream', name: "奶油", label: "奶油 (Cream)" },
  { id: 'hello_kitty', name: "凯蒂猫", label: "凯蒂猫 (Kitty Cat)" }
];

export const STYLES = [
  "柔软棉质 (Soft Cotton)", "丝绸 (Silk)", "蕾丝花边 (Lace frills)", 
  "蝴蝶结 (Ribbons)", "半透明纱 (Sheer fabric)", "波点 (Polka dots)",
  "荷叶边 (Ruffles)", "缎面 (Satin)", "交叉绑带 (Cross straps)", 
  "木耳边 (Lettuce edge)", "侧系带 (Side ties)"
];

export const TYPES = [
  { name: "内裤", en: "panties/underwear", weight: 0.8 }, 
  { name: "文胸", en: "bra/lingerie top", weight: 0.1 },
  { name: "内衣套装", en: "matching lingerie set (bra and panties)", weight: 0.1 }
];

export const FABRICS = [
  "云朵般柔软的精梳棉", "触感冰凉的真丝", "轻盈透气的薄纱", 
  "细腻亲肤的莫代尔", "高光泽感的色丁缎面", "富有弹性的蕾丝",
  "滑溜溜的冰丝", "亲肤纯棉"
];

export const DETAILS = [
  "点缀着精致的刺绣", "镶嵌着闪亮的小水钻", "搭配了甜美的蝴蝶结", 
  "边缘采用了波浪形剪裁", "印有可爱的专属图案", "有着层层叠叠的荷叶边",
  "系带设计增添了一丝俏皮", "带有毛茸茸的贴布", "有着立体的小装饰"
];

export const FEELINGS = [
  "穿上它仿佛置身于童话世界。", "是给肌肤的一封温柔情书。", 
  "心情也会变得粉嫩起来。", "充满了少女的奇思妙想。", 
  "舒适得让人不想脱下来。", "让你在梦中也能保持可爱。"
];

export const SCENTS = [
  "清晨露水味", "甜牛奶味", "草莓软糖味", "阳光晒过的棉被味", 
  "淡雅茉莉香", "海盐香草味", "蜂蜜柚子味", "婴儿爽身粉味",
  "樱花布丁味", "焦糖饼干味"
];

export const OWNERS = [
  "爱丽丝", "初音", "小樱", "月野兔", "不知名的公主", 
  "邻家妹妹", "魔法少女小圆", "森林精灵", "云端天使", "未来的你"
];

// Featured Items from the Video
export const FEATURED_ITEMS = [
  {
    id: 'maid_lace',
    nameSuffix: "黑白蕾丝内内",
    theme: "女仆 (Maid)",
    prompt: "Black panties with white ruffled lace trim edges, white cross-lacing straps on the front sides, small black ribbon bow in center, maid cafe aesthetic, high contrast, cute and sexy.",
    descBase: "有点动感的黑白蕾丝设计，搭配精致的交叉绑带与蝴蝶结，仿佛女仆装般可爱，大包臀设计很有安全感。"
  },
  {
    id: 'red_polka',
    nameSuffix: "红波点系带内内",
    theme: "波点 (Polka Dot)",
    prompt: "Cream white panties with small red polka dots pattern all over, red ribbon tie-side straps on hips, small red bows, soft japanese cotton texture, cute and simple.",
    descBase: "日系奶油白底红色小波点，腰间配有甜美的红色系带与蝴蝶结，纯棉触感十分柔软。"
  },
  {
    id: 'cat_ears',
    nameSuffix: "粉色猫耳内内",
    theme: "猫咪 (Cat Ears)",
    prompt: "Pink panties featuring a large white patch shaped like cat ears on the front, ruffled lettuce-edge hem (wood ear edge), soft pastel pink and white colors, kawaii style.",
    descBase: "粉嫩的配色加上大大的白色猫耳拼接设计，边缘采用凉凉软软的木耳边，少女心爆棚。"
  },
  {
    id: 'cream_bear',
    nameSuffix: "奶油小熊内内",
    theme: "小熊 (Teddy Bear)",
    prompt: "Cream colored glossy silk panties, fuzzy brown teddy bear embroidery patch in the center, adjustable side tie ribbons, soft lighting, cozy vibe.",
    descBase: "奶油色的丝滑面料，中间有一个毛茸茸的小熊贴布萌没边了，侧边带有可解开的温柔绑带。"
  },
  {
    id: 'kitty_face',
    nameSuffix: "大脸猫咪内内",
    theme: "凯蒂猫 (Kitty Face)",
    prompt: "White panties with a large cute minimalist cat face design (whiskers and nose print), featuring a bright red 3D ribbon bow attached on top, Hello Kitty inspired style.",
    descBase: "经典的白底设计配上红色大蝴蝶结，还有可爱的猫脸胡须印花，充满童趣的小心机。"
  }
];