export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  soldOut?: boolean;
  exclusive?: boolean;
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
  tiers: TicketTier[];
};

const IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC1O4Fan1VztsSOvfbIhXajsSec9GmEu_MpVC8Ay_in3OabYFsN4Pq5_TZAUMQ2DqeeaW1LsF2D3zZEKMl_1oQ-1RYt4zF2RA4xzHLBLvL9AhPis8p7WAiKmWJF9UFCLw0rRcjhI7GsKgfC0FmL9qlsn_okfvAsiDN3tSb3nAH88YFIGAaoOESpYSAlPNMTqVPjlXZ66LugA8HEgygOKJ4GaGTaUm_pfAiJp7iDqzOKm4mf42cRpB9UKW2RGz9r6oPFGiHVR0TwZg";
const IMG2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC9BlsJh1ytbzdu948Nc8Sn0VY-Ghf0fkYIoFWbHp2aFnJ00sd35yRN5V-4HLogSecis1WUi9n3fHcxmVyBFHvjwLZ7y2qB4RKS9y7oUPClK2xOt8tNNnjDw9J5zMKnhJsAiqhqEKTYNc505RUcEXlp5X1d1-J5RhNp-GRCerDjjXT3a0k4BRViY4TNsjKMo1F5THcUDwuAyYi0sKtih9OR-44M_SLC0DzjBryx5h6lIWsd9VAze-kyq7BvIRF6fDJZVKHCvaqaOg";
const IMG3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAIlzh3o2VP_QjZh01MoZyKagfZFyu3Xi3pComMnjIXI1n8so1N0eVXCz3ig3Ijo-9lnrp4yCY6pq38wUblaZc0FDAc93LosPuezVyfI82-9v7pC1W9XPSjSStgwQC8007ceN55uz6cxD4ufZCbik4-J2bhJxwQHfKuy6OTzr7ch-IuufE2tA5UDKOV-CJ4Eadb0cqsWje3v9kjbok2eqmdsIKorNkSWPPzTiX4E4gq5t9d1gndDz0t7J3lr2aYsv8UE0OIPeHZlg";

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
    tiers: [
      { id: "early", name: "Early Bird", description: "מכירה מוקדמת - סבב א'", price: 80, soldOut: true },
      { id: "regular", name: "Regular Ticket", description: "כניסה רגילה לכל המתחמים", price: 120 },
      { id: "vip", name: "VIP Experience", description: "כניסה מהירה + מתחם VIP + דרינק ראשון", price: 250, exclusive: true },
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
];

export function getEvent(id: string): NexusEvent | undefined {
  return events.find((e) => e.id === id);
}
