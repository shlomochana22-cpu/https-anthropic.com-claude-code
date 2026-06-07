export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  soldOut?: boolean;
  exclusive?: boolean;
  benefits?: string[];
};

export type NexusEvent = {
  id: string;
  title: string;
  subtitle: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  image: string;
  badge?: string;
  genre: string;
  occupancy: number; // 0-100
  fromPrice: number;
  description?: string;
  age?: string;
  ageVisible?: boolean;
  tiers: TicketTier[];
};

const IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC1O4Fan1VztsSOvfbIhXajsSec9GmEu_MpVC8Ay_in3OabYFsN4Pq5_TZAUMQ2DqeeaW1LsF2D3zZEKMl_1oQ-1RYt4zF2RA4xzHLBLvL9AhPis8p7WAiKmWJF9UFCLw0rRcjhI7GsKgfC0FmL9qlsn_okfvAsiDN3tSb3nAH88YFIGAaoOESpYSAlPNMTqVPjlXZ66LugA8HEgygOKJ4GaGTaUm_pfAiJp7iDqzOKm4mf42cRpB9UKW2RGz9r6oPFGiHVR0TwZg";
const IMG2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9BlsJh1ytbzdu948Nc8Sn0VY-Ghf0fkYIoFWbHp2aFnJ00sd35yRN5V-4HLogSecis1WUi9n3fHcxmVyBFHvjwLZ7y2qB4RKS9y7oUPClK2xOt8tNNnjDw9J5zMKnhJsAiqhqEKTYNc505RUcEXlp5X1d1-J5RhNp-GRCerDjjXT3a0k4BRViY4TNsjKMo1F5THcUDwuAyYi0sKtih9OR-44M_SLC0DzjBryx5h6lIWsd9VAze-kyq7BvIRF6fDJZVKHCvaqaOg";
const IMG3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIlzh3o2VP_QjZh01MoZyKagfZFyu3Xi3pComMnjIXI1n8so1N0eVXCz3ig3Ijo-9lnrp4yCY6pq38wUblaZc0FDAc93LosPuezVyfI82-9v7pC1W9XPSjSStgwQC8007ceN55uz6cxD4ufZCbik4-J2bhJxwQHfKuy6OTzr7ch-IuufE2tA5UDKOV-CJ4Eadb0cqsWje3v9kjbok2eqmdsIKorNkSWPPzTiX4E4gq5t9d1gndDz0t7J3lr2aYsv8UE0OIPeHZlg";
const IMG_FOREST =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Hjff4EH-F3Sdbz5y4o-3DyDv6jG0pN4rOEg9Xg7ctZdGYb44Zz7XnyRoUT3Sk9Btq2TH8MWl7_93NK_7ufmI6cabBXkvglwP9sV14SIylNZDhtUBNSp5QXZ44LKG_mpFRHuuedcag0MbXMKov5zZ72SwQzIiq6RDo8D5NS9A6yrNz0F7Bu1mD-QhaYT4YHUeEWWi6-DNL_MNALsJST5jPD80G94s_ZTq_EKHe6dvmIUZPdWC_IiWOu4ZfIXFHQiQH1r1kBZ9Gg";
const IMG_INDUSTRIAL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB3QYWUZ9Wkli9oW7XrIte6wVWldOFyGnnrPwefTnGKayQNRA6sgcxnRTw6lBxKqDbzDcH0BK2Rp8KoA3uNmNkmm_e11Efa6bJkHKwUXKvWqu5eRUUKUbf9M_r7qY5LTnJyYpFlK2HQQ8hD6dDysDpvWszcpE_JkRvQHkFCNLeGT2BkxY1ERrErBUIEMTMa7x868pymI-bfbqpeVutQIegIUTSf9hTawyZFVX0uVAnL9G7jTdzx9nOjDpKqaQWsr0LnmUoru9akBQ";
const IMG_POOL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAINH71GmXS2WnTmrT0lyQPuH9ZrX1x2j75V5wGowNSTrJeHASXGF144chc3k--crgfN7nSSPzZSSx-14Jf1_jgmVfGeQJF4m9vcpI1g-iOxNtALobYBrLYzQ7Wpb5XOmYnxsR8qi1M_pYWGVyXIpEY3gU61cf7yZ820AkZTzVlxMcTUQODkI0qN4BF_Ukgil9NVTdYhvtpCAx4LhXVmN3wxIIcvEZ_KBma-eh1QyRjHDKhgBAXVSeTZIpolF1Y61z12oPsu94_oQ";

export const events: NexusEvent[] = [
  {
    id: "electric-night",
    title: "Electric Night at Block Club",
    subtitle: "לילה בלתי נשכח במועדון הבלוק",
    venue: "מועדון הבלוק",
    city: "תל אביב",
    date: "24.05.24",
    time: "23:00",
    image: IMG,
    badge: "Fast Selling",
    genre: "טכנו",
    occupancy: 85,
    fromPrice: 120,
    age: "18+",
    ageVisible: true,
    tiers: [
      { id: "early", name: "Early Bird", description: "מכירה מוקדמת - סבב א'", price: 80, soldOut: true },
      { id: "regular", name: "Regular Ticket", description: "כניסה רגילה לכל המתחמים", price: 120 },
      { id: "vip", name: "VIP Experience", description: "החבילה המלאה", price: 250, exclusive: true, benefits: ["גישה לבקסטייג׳", "כניסה מהירה", "דרינק ראשון על הבית"] },
    ],
  },
  {
    id: "summer-odyssey",
    title: "SUMMER ODYSSEY 2024",
    subtitle: "פסטיבל הטכנו הגדול של הקיץ",
    venue: "האומן 17",
    city: "תל אביב",
    date: "24.08",
    time: "23:00",
    image: IMG2,
    badge: "TOP PICK",
    genre: "מיינסטרים",
    occupancy: 72,
    fromPrice: 180,
    tiers: [
      { id: "regular", name: "Regular Ticket", description: "כניסה רגילה", price: 180 },
      { id: "vip", name: "VIP", description: "מתחם VIP", price: 320, exclusive: true },
    ],
  },
  {
    id: "neon-rooftop",
    title: "NEON ROOFTOP SESSIONS",
    subtitle: "מסיבת גג עם נוף לים",
    venue: "גג העיר",
    city: "חיפה",
    date: "30.08",
    time: "22:00",
    image: IMG3,
    badge: "מכירה אחרונה",
    genre: "פופ",
    occupancy: 91,
    fromPrice: 120,
    tiers: [
      { id: "regular", name: "Regular Ticket", description: "כניסה רגילה", price: 120 },
    ],
  },
  {
    id: "secret-forest-rave",
    title: "SECRET FOREST RAVE",
    subtitle: "ריב בלב היער, עד הזריחה",
    venue: "יער בן שמן",
    city: "מרכז",
    date: "01.09",
    time: "22:00",
    image: IMG_FOREST,
    badge: "מיקום סודי",
    genre: "פסייטראנס",
    occupancy: 64,
    fromPrice: 90,
    tiers: [
      { id: "regular", name: "כניסה רגילה", description: "כולל חניה", price: 90 },
      { id: "transport", name: "כרטיס + הסעה", description: "הסעות מהמרכז", price: 140, exclusive: true },
    ],
  },
  {
    id: "industrial-techno",
    title: "INDUSTRIAL TECHNO NIGHT",
    subtitle: "טכנו תעשייתי כבד עד הבוקר",
    venue: "מועדון הבלוק",
    city: "תל אביב",
    date: "02.09",
    time: "23:30",
    image: IMG_INDUSTRIAL,
    badge: "Fast Selling",
    genre: "טכנו",
    occupancy: 78,
    fromPrice: 150,
    tiers: [
      { id: "regular", name: "Regular", description: "כניסה רגילה", price: 150 },
      { id: "vip", name: "VIP Bunker", description: "מתחם VIP + בר פתוח שעה", price: 290, exclusive: true },
    ],
  },
  {
    id: "pool-vibes-eilat",
    title: "POOL VIBES: EILAT EDITION",
    subtitle: "מסיבת בריכה על שפת הים האדום",
    venue: "מלון רויאל",
    city: "אילת",
    date: "03.09",
    time: "14:00",
    image: IMG_POOL,
    badge: "TOP PICK",
    genre: "מיינסטרים",
    occupancy: 55,
    fromPrice: 220,
    tiers: [
      { id: "regular", name: "כניסה לבריכה", description: "כולל מגבת", price: 220 },
      { id: "cabana", name: "Cabana VIP", description: "קבנה פרטית + שירות", price: 480, exclusive: true },
    ],
  },
];

export function getEvent(id: string): NexusEvent | undefined {
  return events.find((e) => e.id === id);
}
