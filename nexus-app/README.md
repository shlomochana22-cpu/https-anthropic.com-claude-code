# NEXUS — Next.js App (Phase 2)

המרת אפליקציית NEXUS ל-**Next.js 14 (App Router) + TypeScript + Tailwind**.
זהו השלב השני: ארכיטקטורת קומפוננטות אמיתית, routing, ו-state — מבוסס על
מערכת העיצוב (design tokens) שחולצה מהמוקאפים הסטטיים שב-`../screens/`.

## הרצה

```bash
cd nexus-app
npm install
npm run dev      # http://localhost:3000
```

## ארכיטקטורה

```
app/
  layout.tsx            # RTL, גופן Varela Round, globals
  globals.css           # helper classes: glass / neon / scrollbar
  page.tsx              # דף בית / גילוי
  events/[id]/page.tsx  # עמוד אירוע דינמי
  checkout/page.tsx     # סיכום הזמנה + תשלום
  confirmation/page.tsx # אישור + NEXUS PASS (QR)
  tickets/page.tsx      # הכרטיסים שלי
  profile|favorites|notifications/  # stubs (בהמרה)
components/
  Header, BottomNav, EventCard, EventDetail, PayButton, Icon, StubPage
lib/
  events.ts             # שכבת נתונים (mock — יוחלף ב-Supabase בשלב 3)
tailwind.config.ts      # design tokens: צבעי NEXUS, spacing, typography
```

## משפך עובד (state + routing אמיתי)

`/` → `/events/[id]` → בחירת כרטיסים (state) → `/checkout` → `/confirmation` → `/tickets`

## הבא בתור
- המרת שאר המסכים מ-`screens/` לקומפוננטות React.
- **שלב 3:** חיבור Supabase (`lib/events.ts` → שאילתות אמיתיות, Auth, QR).
