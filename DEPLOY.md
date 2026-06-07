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

הריפו כבר מחובר ל-GitHub, אז זה כמעט בלחיצה אחת:

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
