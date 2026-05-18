export const CATEGORIES = [
  "food",
  "transport",
  "home",
  "household",
  "clubs",
  "kids",
  "clothes",
  "health",
  "fun",
  "gifts",
  "income",
  "other",
];

export const CATEGORY_META = {
  food:      { label: "Food",      color: "#F4A261", bg: "#FEF3E8", emoji: "🍕" },
  transport: { label: "Transport", color: "#F07070", bg: "#FEF0F0", emoji: "🚌" },
  home:      { label: "Home",      color: "#5DC191", bg: "#EAF7F1", emoji: "🏠" },
  household: { label: "Household", color: "#E76F51", bg: "#FDF0EB", emoji: "🧹" },
  clubs:     { label: "Clubs",     color: "#48BFE3", bg: "#E8F7FC", emoji: "🎭" },
  kids:      { label: "Kids",      color: "#C77DFF", bg: "#F4EBFF", emoji: "🧸" },
  clothes:   { label: "Clothes",   color: "#74B9FF", bg: "#E8F3FF", emoji: "👕" },
  health:    { label: "Health",    color: "#F07070", bg: "#FEF0F0", emoji: "💊" },
  fun:       { label: "Fun",       color: "#A8DADC", bg: "#EBF7F8", emoji: "🎉" },
  gifts:     { label: "Gifts",     color: "#FBBF24", bg: "#FEF9E7", emoji: "🎁" },
  income:    { label: "Income",    color: "#5DC191", bg: "#EAF7F1", emoji: "💰" },
  other:     { label: "Other",     color: "#8FA89E", bg: "#F0F4F3", emoji: "📦" },
};

// Keywords for smart input parsing (Ukrainian + English, lowercase)
export const CATEGORY_KEYWORDS = {
  food:      ["їжа", "ресторан", "кафе", "продукти", "обід", "вечеря", "сніданок", "перекус", "піца", "суші", "фастфуд", "food", "cafe", "restaurant", "grocery", "lunch", "dinner", "breakfast", "pizza", "sushi"],
  transport: ["транспорт", "метро", "таксі", "бензин", "автобус", "маршрутка", "bolt", "uber", "transport", "taxi", "metro", "fuel", "bus"],
  home:      ["квартира", "дім", "оренда", "ремонт", "комуналка", "комунальні", "інтернет", "home", "apartment", "rent", "repair", "utilities", "internet"],
  household: ["побут", "прибирання", "посуд", "господарство", "household", "cleaning", "dishes"],
  clubs:     ["гурток", "гуртки", "секція", "секції", "clubs", "club", "course", "lesson", "клас", "dance"],
  kids:      ["діти", "дитина", "дитячий", "садочок", "іграшки", "kid", "kids", "child", "baby", "toys", "kindergarten"],
  clothes:   ["одяг", "взуття", "шопінг", "магазин", "clothes", "shoes", "shopping", "outfit"],
  health:    ["аптека", "лікар", "ліки", "аналізи", "стоматолог", "health", "pharmacy", "doctor", "medicine", "dentist"],
  fun:       ["розваги", "кіно", "театр", "відпочинок", "fun", "cinema", "movie", "entertainment", "leisure"],
  gifts:     ["подарунок", "подарунки", "свято", "gifts", "gift", "birthday", "holiday", "день народження"],
  income:    ["зарплата", "зп", "доход", "премія", "salary", "income", "revenue", "bonus"],
  other:     ["інше", "other", "misc"],
};
