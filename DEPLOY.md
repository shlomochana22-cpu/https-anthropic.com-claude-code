# איך לראות את NEXUS

יש שתי דרכים — אחת מיידית (בלי כלום), ואחת שנותנת URL ציבורי.

---

## 1) הכי מהיר — האתר הסטטי (בלי התקנות, נפתח בדפדפן)

הגרסה הסטטית המלאה (34 מסכים) עובדת בלי שום כלי — רק דפדפן:

```bash
git pull origin claude/laughing-heisenberg-c9Ugs
```
עכשיו פשוט **לחץ פעמיים על `index.html`** (או גרור אותו לדפדפן).
זהו מרכז הניווט — לחץ על כל מסך כדי לפתוח אותו. הכל מעוצב ועובד.

> טיפ: לחוויה מלאה אפשר גם `cd` לתיקיית הפרויקט ולהריץ
> `python3 -m http.server 8000` ואז לגלוש ל-http://localhost:8000

---

## 2) האפליקציה האמיתית (React/Next.js) — מקומית

```bash
git pull origin claude/laughing-heisenberg-c9Ugs
cd nexus-app
npm install
npm run dev          # http://localhost:3000
```
רץ מיד עם נתוני דמו (mock). למסד נתונים אמיתי: ראה `nexus-app/README.md`.

---

## 3) URL ציבורי — פריסה ל-Vercel (חינם, ~2 דקות)

**לינק ייבוא ישיר** (מתחבר עם GitHub ובוחר את הריפו אוטומטית):
<https://vercel.com/new/git/external?repository-url=https://github.com/shlomochana22-cpu/https-anthropic.com-claude-code&root-directory=nexus-app&project-name=nexus-events>

> חשוב לוודא שב-**Root Directory** מופיע `nexus-app`. הקובץ `nexus-app/vercel.json`
> כבר מגדיר framework=Next.js, buildCommand ו-installCommand — אין מה להגדיר ידנית.

או ידנית — הריפו כבר מחובר ל-GitHub, אז זה כמעט בלחיצה אחת:

1. היכנס ל-[vercel.com](https://vercel.com) והתחבר עם GitHub.
2. **Add New → Project** → בחר את הריפו
   `shlomochana22-cpu/https-anthropic.com-claude-code`.
3. בחלון ההגדרות, תחת **Root Directory** בחר **`nexus-app`** (חשוב!).
   Framework יזוהה אוטומטית כ-Next.js.
4. (אופציונלי) להוסיף את משתני Supabase תחת **Environment Variables**
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   בלי זה — האתר עובד עם נתוני דמו.
5. **Deploy**. תוך דקה תקבל כתובת `https://...vercel.app` שאפשר לשתף.

> כל push ל-branch יפרוס אוטומטית גרסה מעודכנת.

---

## 4.5) הפעלת נתונים אמיתיים (Supabase) על האתר החי

האתר רץ עם נתוני דמו עד שמחברים Supabase. כדי להפוך אותו ל"אמיתי":

1. **צור פרויקט** ב-[supabase.com](https://supabase.com).
2. **הרץ את הסכמה** — פתח SQL Editor והדבק את כל
   `nexus-app/supabase/migrations/0001_init.sql` → Run.
   (זה יוצר events, ticket_tiers, profiles, orders, tickets + RLS + נתוני התחלה.)
3. **הוסף את המפתחות ב-Vercel** — Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = ה-Project URL (מ-Settings → API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ה-anon public key
4. **Redeploy** (Deployments → ⋯ → Redeploy).

מרגע זה, באתר החי:
- האירועים נטענים מ-Postgres (כולל אירועים שמפיק יוצר ב"יצירת אירוע").
- כניסה/הרשמה עוברת דרך Supabase Auth.
- רכישה יוצרת `order` + `ticket` אמיתיים, ומסך "הכרטיסים שלי" מציג QR סָריק.
- הסורק (`/producer/scanner`) מאמת את ה-QR מול ה-DB.

## 4) חיבור הדומיין שלך — nexusevents.co.il

לאחר שהאתר עלה ל-Vercel:

### א. הוסף את הדומיין ב-Vercel
Project → **Settings → Domains** → הקלד `nexusevents.co.il` → **Add**.
הוסף גם `www.nexusevents.co.il` (Vercel יגדיר הפניה אוטומטית בין השניים).
Vercel יציג לך את רשומות ה-DNS המדויקות — בדרך כלל אלה:

| רשומה | שם / Host | ערך / Value |
|-------|-----------|-------------|
| **A** | `@` (השורש) | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

### ב. הגדר את ה-DNS אצל הרשם (איפה שקנית את הדומיין)
היכנס לפאנל הניהול של הדומיין `.co.il` (למשל דומיין-דה-נט / Domain The Net,
GoDaddy, או הרשם שדרכו רכשת) → אזור **DNS / ניהול רשומות** → הוסף את שתי
הרשומות מהטבלה למעלה. אם כבר קיימת רשומת A/CNAME לשורש או ל-www — ערוך אותן.

### ג. המתן והפעל SSL
התפשטות DNS לוקחת בין דקות לכמה שעות. כש-Vercel מזהה את הרשומות, הוא **מנפיק
תעודת SSL (HTTPS) אוטומטית** — בלי צעד נוסף. בסיום: `https://nexusevents.co.il`
חי. ✅

> חלופות זהות ברעיון: **Cloudflare Pages** או **Netlify** — אותה שיטה (הוסף דומיין,
> הצבע עם A/CNAME, SSL אוטומטי). אם תרצה אפרט גם להן.

### אם תעדיף שה-DNS יתנהל ב-Cloudflare (מומלץ ל-.co.il)
1. פתח חשבון Cloudflare חינמי והוסף את `nexusevents.co.il`.
2. Cloudflare ייתן לך 2 כתובות **Nameservers** — עדכן אותן אצל הרשם הישראלי.
3. ב-Cloudflare הוסף את רשומות ה-A/CNAME של Vercel (כמו בטבלה).
   זה נותן ניהול DNS נוח + הגנה/CDN.
