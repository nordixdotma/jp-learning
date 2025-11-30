// Complete Hiragana, Katakana, and Numbers data for KanaStarter

export type KanaType = "hiragana" | "katakana" | "numbers"

export interface KanaItem {
  id: string
  character: string
  romaji: string
  type: KanaType
  group: string
  audioUrl?: string
  strokeCount?: number
}

export interface LessonGroup {
  id: string
  name: string
  description: string
  type: KanaType
  items: KanaItem[]
  order: number
}

// Hiragana data organized by row (vowel groups)
export const hiraganaData: KanaItem[] = [
  // Vowels (a-row)
  { id: "h-a", character: "あ", romaji: "a", type: "hiragana", group: "vowels", strokeCount: 3 },
  { id: "h-i", character: "い", romaji: "i", type: "hiragana", group: "vowels", strokeCount: 2 },
  { id: "h-u", character: "う", romaji: "u", type: "hiragana", group: "vowels", strokeCount: 2 },
  { id: "h-e", character: "え", romaji: "e", type: "hiragana", group: "vowels", strokeCount: 2 },
  { id: "h-o", character: "お", romaji: "o", type: "hiragana", group: "vowels", strokeCount: 3 },

  // K-row
  { id: "h-ka", character: "か", romaji: "ka", type: "hiragana", group: "k-row", strokeCount: 3 },
  { id: "h-ki", character: "き", romaji: "ki", type: "hiragana", group: "k-row", strokeCount: 4 },
  { id: "h-ku", character: "く", romaji: "ku", type: "hiragana", group: "k-row", strokeCount: 1 },
  { id: "h-ke", character: "け", romaji: "ke", type: "hiragana", group: "k-row", strokeCount: 3 },
  { id: "h-ko", character: "こ", romaji: "ko", type: "hiragana", group: "k-row", strokeCount: 2 },

  // S-row
  { id: "h-sa", character: "さ", romaji: "sa", type: "hiragana", group: "s-row", strokeCount: 3 },
  { id: "h-shi", character: "し", romaji: "shi", type: "hiragana", group: "s-row", strokeCount: 1 },
  { id: "h-su", character: "す", romaji: "su", type: "hiragana", group: "s-row", strokeCount: 2 },
  { id: "h-se", character: "せ", romaji: "se", type: "hiragana", group: "s-row", strokeCount: 3 },
  { id: "h-so", character: "そ", romaji: "so", type: "hiragana", group: "s-row", strokeCount: 1 },

  // T-row
  { id: "h-ta", character: "た", romaji: "ta", type: "hiragana", group: "t-row", strokeCount: 4 },
  { id: "h-chi", character: "ち", romaji: "chi", type: "hiragana", group: "t-row", strokeCount: 2 },
  { id: "h-tsu", character: "つ", romaji: "tsu", type: "hiragana", group: "t-row", strokeCount: 1 },
  { id: "h-te", character: "て", romaji: "te", type: "hiragana", group: "t-row", strokeCount: 1 },
  { id: "h-to", character: "と", romaji: "to", type: "hiragana", group: "t-row", strokeCount: 2 },

  // N-row
  { id: "h-na", character: "な", romaji: "na", type: "hiragana", group: "n-row", strokeCount: 4 },
  { id: "h-ni", character: "に", romaji: "ni", type: "hiragana", group: "n-row", strokeCount: 3 },
  { id: "h-nu", character: "ぬ", romaji: "nu", type: "hiragana", group: "n-row", strokeCount: 2 },
  { id: "h-ne", character: "ね", romaji: "ne", type: "hiragana", group: "n-row", strokeCount: 2 },
  { id: "h-no", character: "の", romaji: "no", type: "hiragana", group: "n-row", strokeCount: 1 },

  // H-row
  { id: "h-ha", character: "は", romaji: "ha", type: "hiragana", group: "h-row", strokeCount: 3 },
  { id: "h-hi", character: "ひ", romaji: "hi", type: "hiragana", group: "h-row", strokeCount: 1 },
  { id: "h-fu", character: "ふ", romaji: "fu", type: "hiragana", group: "h-row", strokeCount: 4 },
  { id: "h-he", character: "へ", romaji: "he", type: "hiragana", group: "h-row", strokeCount: 1 },
  { id: "h-ho", character: "ほ", romaji: "ho", type: "hiragana", group: "h-row", strokeCount: 4 },

  // M-row
  { id: "h-ma", character: "ま", romaji: "ma", type: "hiragana", group: "m-row", strokeCount: 3 },
  { id: "h-mi", character: "み", romaji: "mi", type: "hiragana", group: "m-row", strokeCount: 2 },
  { id: "h-mu", character: "む", romaji: "mu", type: "hiragana", group: "m-row", strokeCount: 3 },
  { id: "h-me", character: "め", romaji: "me", type: "hiragana", group: "m-row", strokeCount: 2 },
  { id: "h-mo", character: "も", romaji: "mo", type: "hiragana", group: "m-row", strokeCount: 3 },

  // Y-row
  { id: "h-ya", character: "や", romaji: "ya", type: "hiragana", group: "y-row", strokeCount: 3 },
  { id: "h-yu", character: "ゆ", romaji: "yu", type: "hiragana", group: "y-row", strokeCount: 2 },
  { id: "h-yo", character: "よ", romaji: "yo", type: "hiragana", group: "y-row", strokeCount: 2 },

  // R-row
  { id: "h-ra", character: "ら", romaji: "ra", type: "hiragana", group: "r-row", strokeCount: 2 },
  { id: "h-ri", character: "り", romaji: "ri", type: "hiragana", group: "r-row", strokeCount: 2 },
  { id: "h-ru", character: "る", romaji: "ru", type: "hiragana", group: "r-row", strokeCount: 1 },
  { id: "h-re", character: "れ", romaji: "re", type: "hiragana", group: "r-row", strokeCount: 2 },
  { id: "h-ro", character: "ろ", romaji: "ro", type: "hiragana", group: "r-row", strokeCount: 1 },

  // W-row + N
  { id: "h-wa", character: "わ", romaji: "wa", type: "hiragana", group: "w-row", strokeCount: 2 },
  { id: "h-wo", character: "を", romaji: "wo", type: "hiragana", group: "w-row", strokeCount: 3 },
  { id: "h-n", character: "ん", romaji: "n", type: "hiragana", group: "w-row", strokeCount: 1 },
]

// Katakana data organized by row
export const katakanaData: KanaItem[] = [
  // Vowels
  { id: "k-a", character: "ア", romaji: "a", type: "katakana", group: "vowels", strokeCount: 2 },
  { id: "k-i", character: "イ", romaji: "i", type: "katakana", group: "vowels", strokeCount: 2 },
  { id: "k-u", character: "ウ", romaji: "u", type: "katakana", group: "vowels", strokeCount: 3 },
  { id: "k-e", character: "エ", romaji: "e", type: "katakana", group: "vowels", strokeCount: 3 },
  { id: "k-o", character: "オ", romaji: "o", type: "katakana", group: "vowels", strokeCount: 3 },

  // K-row
  { id: "k-ka", character: "カ", romaji: "ka", type: "katakana", group: "k-row", strokeCount: 2 },
  { id: "k-ki", character: "キ", romaji: "ki", type: "katakana", group: "k-row", strokeCount: 3 },
  { id: "k-ku", character: "ク", romaji: "ku", type: "katakana", group: "k-row", strokeCount: 2 },
  { id: "k-ke", character: "ケ", romaji: "ke", type: "katakana", group: "k-row", strokeCount: 3 },
  { id: "k-ko", character: "コ", romaji: "ko", type: "katakana", group: "k-row", strokeCount: 2 },

  // S-row
  { id: "k-sa", character: "サ", romaji: "sa", type: "katakana", group: "s-row", strokeCount: 3 },
  { id: "k-shi", character: "シ", romaji: "shi", type: "katakana", group: "s-row", strokeCount: 3 },
  { id: "k-su", character: "ス", romaji: "su", type: "katakana", group: "s-row", strokeCount: 2 },
  { id: "k-se", character: "セ", romaji: "se", type: "katakana", group: "s-row", strokeCount: 2 },
  { id: "k-so", character: "ソ", romaji: "so", type: "katakana", group: "s-row", strokeCount: 2 },

  // T-row
  { id: "k-ta", character: "タ", romaji: "ta", type: "katakana", group: "t-row", strokeCount: 3 },
  { id: "k-chi", character: "チ", romaji: "chi", type: "katakana", group: "t-row", strokeCount: 3 },
  { id: "k-tsu", character: "ツ", romaji: "tsu", type: "katakana", group: "t-row", strokeCount: 3 },
  { id: "k-te", character: "テ", romaji: "te", type: "katakana", group: "t-row", strokeCount: 3 },
  { id: "k-to", character: "ト", romaji: "to", type: "katakana", group: "t-row", strokeCount: 2 },

  // N-row
  { id: "k-na", character: "ナ", romaji: "na", type: "katakana", group: "n-row", strokeCount: 2 },
  { id: "k-ni", character: "ニ", romaji: "ni", type: "katakana", group: "n-row", strokeCount: 2 },
  { id: "k-nu", character: "ヌ", romaji: "nu", type: "katakana", group: "n-row", strokeCount: 2 },
  { id: "k-ne", character: "ネ", romaji: "ne", type: "katakana", group: "n-row", strokeCount: 4 },
  { id: "k-no", character: "ノ", romaji: "no", type: "katakana", group: "n-row", strokeCount: 1 },

  // H-row
  { id: "k-ha", character: "ハ", romaji: "ha", type: "katakana", group: "h-row", strokeCount: 2 },
  { id: "k-hi", character: "ヒ", romaji: "hi", type: "katakana", group: "h-row", strokeCount: 2 },
  { id: "k-fu", character: "フ", romaji: "fu", type: "katakana", group: "h-row", strokeCount: 1 },
  { id: "k-he", character: "ヘ", romaji: "he", type: "katakana", group: "h-row", strokeCount: 1 },
  { id: "k-ho", character: "ホ", romaji: "ho", type: "katakana", group: "h-row", strokeCount: 4 },

  // M-row
  { id: "k-ma", character: "マ", romaji: "ma", type: "katakana", group: "m-row", strokeCount: 2 },
  { id: "k-mi", character: "ミ", romaji: "mi", type: "katakana", group: "m-row", strokeCount: 3 },
  { id: "k-mu", character: "ム", romaji: "mu", type: "katakana", group: "m-row", strokeCount: 2 },
  { id: "k-me", character: "メ", romaji: "me", type: "katakana", group: "m-row", strokeCount: 2 },
  { id: "k-mo", character: "モ", romaji: "mo", type: "katakana", group: "m-row", strokeCount: 3 },

  // Y-row
  { id: "k-ya", character: "ヤ", romaji: "ya", type: "katakana", group: "y-row", strokeCount: 2 },
  { id: "k-yu", character: "ユ", romaji: "yu", type: "katakana", group: "y-row", strokeCount: 2 },
  { id: "k-yo", character: "ヨ", romaji: "yo", type: "katakana", group: "y-row", strokeCount: 3 },

  // R-row
  { id: "k-ra", character: "ラ", romaji: "ra", type: "katakana", group: "r-row", strokeCount: 2 },
  { id: "k-ri", character: "リ", romaji: "ri", type: "katakana", group: "r-row", strokeCount: 2 },
  { id: "k-ru", character: "ル", romaji: "ru", type: "katakana", group: "r-row", strokeCount: 2 },
  { id: "k-re", character: "レ", romaji: "re", type: "katakana", group: "r-row", strokeCount: 1 },
  { id: "k-ro", character: "ロ", romaji: "ro", type: "katakana", group: "r-row", strokeCount: 3 },

  // W-row + N
  { id: "k-wa", character: "ワ", romaji: "wa", type: "katakana", group: "w-row", strokeCount: 2 },
  { id: "k-wo", character: "ヲ", romaji: "wo", type: "katakana", group: "w-row", strokeCount: 3 },
  { id: "k-n", character: "ン", romaji: "n", type: "katakana", group: "w-row", strokeCount: 2 },
]

// Japanese numbers
export const numbersData: KanaItem[] = [
  { id: "n-0", character: "零", romaji: "rei / zero", type: "numbers", group: "basic" },
  { id: "n-1", character: "一", romaji: "ichi", type: "numbers", group: "basic" },
  { id: "n-2", character: "二", romaji: "ni", type: "numbers", group: "basic" },
  { id: "n-3", character: "三", romaji: "san", type: "numbers", group: "basic" },
  { id: "n-4", character: "四", romaji: "yon / shi", type: "numbers", group: "basic" },
  { id: "n-5", character: "五", romaji: "go", type: "numbers", group: "basic" },
  { id: "n-6", character: "六", romaji: "roku", type: "numbers", group: "basic" },
  { id: "n-7", character: "七", romaji: "nana / shichi", type: "numbers", group: "basic" },
  { id: "n-8", character: "八", romaji: "hachi", type: "numbers", group: "basic" },
  { id: "n-9", character: "九", romaji: "kyuu / ku", type: "numbers", group: "basic" },
  { id: "n-10", character: "十", romaji: "juu", type: "numbers", group: "basic" },
  { id: "n-100", character: "百", romaji: "hyaku", type: "numbers", group: "advanced" },
  { id: "n-1000", character: "千", romaji: "sen", type: "numbers", group: "advanced" },
]

// Lesson groups for structured learning
export const lessonGroups: LessonGroup[] = [
  {
    id: "h-vowels",
    name: "Hiragana Vowels",
    description: "Learn the 5 basic vowel sounds: あ い う え お",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "vowels"),
    order: 1,
  },
  {
    id: "h-k-row",
    name: "Hiragana K-Row",
    description: "Learn the K consonant sounds: か き く け こ",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "k-row"),
    order: 2,
  },
  {
    id: "h-s-row",
    name: "Hiragana S-Row",
    description: "Learn the S consonant sounds: さ し す せ そ",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "s-row"),
    order: 3,
  },
  {
    id: "h-t-row",
    name: "Hiragana T-Row",
    description: "Learn the T consonant sounds: た ち つ て と",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "t-row"),
    order: 4,
  },
  {
    id: "h-n-row",
    name: "Hiragana N-Row",
    description: "Learn the N consonant sounds: な に ぬ ね の",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "n-row"),
    order: 5,
  },
  {
    id: "h-h-row",
    name: "Hiragana H-Row",
    description: "Learn the H consonant sounds: は ひ ふ へ ほ",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "h-row"),
    order: 6,
  },
  {
    id: "h-m-row",
    name: "Hiragana M-Row",
    description: "Learn the M consonant sounds: ま み む め も",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "m-row"),
    order: 7,
  },
  {
    id: "h-y-row",
    name: "Hiragana Y-Row",
    description: "Learn the Y sounds: や ゆ よ",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "y-row"),
    order: 8,
  },
  {
    id: "h-r-row",
    name: "Hiragana R-Row",
    description: "Learn the R consonant sounds: ら り る れ ろ",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "r-row"),
    order: 9,
  },
  {
    id: "h-w-row",
    name: "Hiragana W-Row & N",
    description: "Learn the final characters: わ を ん",
    type: "hiragana",
    items: hiraganaData.filter((k) => k.group === "w-row"),
    order: 10,
  },
  {
    id: "k-vowels",
    name: "Katakana Vowels",
    description: "Learn the 5 basic vowel sounds: ア イ ウ エ オ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "vowels"),
    order: 11,
  },
  {
    id: "k-k-row",
    name: "Katakana K-Row",
    description: "Learn the K consonant sounds: カ キ ク ケ コ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "k-row"),
    order: 12,
  },
  {
    id: "k-s-row",
    name: "Katakana S-Row",
    description: "Learn the S consonant sounds: サ シ ス セ ソ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "s-row"),
    order: 13,
  },
  {
    id: "k-t-row",
    name: "Katakana T-Row",
    description: "Learn the T consonant sounds: タ チ ツ テ ト",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "t-row"),
    order: 14,
  },
  {
    id: "k-n-row",
    name: "Katakana N-Row",
    description: "Learn the N consonant sounds: ナ ニ ヌ ネ ノ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "n-row"),
    order: 15,
  },
  {
    id: "k-h-row",
    name: "Katakana H-Row",
    description: "Learn the H consonant sounds: ハ ヒ フ ヘ ホ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "h-row"),
    order: 16,
  },
  {
    id: "k-m-row",
    name: "Katakana M-Row",
    description: "Learn the M consonant sounds: マ ミ ム メ モ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "m-row"),
    order: 17,
  },
  {
    id: "k-y-row",
    name: "Katakana Y-Row",
    description: "Learn the Y sounds: ヤ ユ ヨ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "y-row"),
    order: 18,
  },
  {
    id: "k-r-row",
    name: "Katakana R-Row",
    description: "Learn the R consonant sounds: ラ リ ル レ ロ",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "r-row"),
    order: 19,
  },
  {
    id: "k-w-row",
    name: "Katakana W-Row & N",
    description: "Learn the final characters: ワ ヲ ン",
    type: "katakana",
    items: katakanaData.filter((k) => k.group === "w-row"),
    order: 20,
  },
  {
    id: "numbers-basic",
    name: "Basic Numbers (0-10)",
    description: "Learn to count from 0 to 10 in Japanese",
    type: "numbers",
    items: numbersData.filter((n) => n.group === "basic"),
    order: 21,
  },
  {
    id: "numbers-advanced",
    name: "Advanced Numbers",
    description: "Learn hundreds and thousands",
    type: "numbers",
    items: numbersData.filter((n) => n.group === "advanced"),
    order: 22,
  },
]

// Helper functions
export function getKanaByType(type: KanaType): KanaItem[] {
  switch (type) {
    case "hiragana":
      return hiraganaData
    case "katakana":
      return katakanaData
    case "numbers":
      return numbersData
    default:
      return []
  }
}

export function getLessonsByType(type: KanaType): LessonGroup[] {
  return lessonGroups.filter((l) => l.type === type).sort((a, b) => a.order - b.order)
}

export function getKanaById(id: string): KanaItem | undefined {
  return [...hiraganaData, ...katakanaData, ...numbersData].find((k) => k.id === id)
}

export function getAllKana(): KanaItem[] {
  return [...hiraganaData, ...katakanaData, ...numbersData]
}
