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

## שלב 3 — Supabase (התשתית מוכנה)

שכבת הנתונים מחוברת ל-Supabase עם **fallback אוטומטי ל-mock** — האפליקציה
רצה גם בלי מפתחות, וברגע שמוסיפים אותם היא קוראת מה-DB האמיתי.

```
lib/supabase.ts                 # client (נוצר רק כשיש env)
lib/queries.ts                  # getEvents/getEventById — DB או mock
supabase/migrations/0001_init.sql  # סכמה + RLS + טריגר משתמש + seed
.env.example                    # NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
```

### הקמה
1. צרו פרויקט ב-[supabase.com](https://supabase.com).
2. הריצו את `supabase/migrations/0001_init.sql` ב-SQL editor.
3. `cp .env.example .env.local` ומלאו URL + anon key מ-Project Settings → API.
4. `npm run dev` — עכשיו הנתונים מגיעים מ-Postgres.

**סכמה:** `events`, `ticket_tiers`, `profiles`, `orders`, `tickets`
(עם RLS owner-only, QR ייחודי לכל כרטיס, וטריגר ליצירת profile בהרשמה).

## הבא בתור
- המרת שאר המסכים מ-`screens/` לקומפוננטות React (profile/favorites/notifications הם stubs; צד מפיק/אדמין טרם הומר).
- Supabase Auth (login/signup) + יצירת `orders`/`tickets` אמיתיים ב-checkout.
- אימות QR אמיתי במסך הסורק.
