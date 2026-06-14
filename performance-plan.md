# תוכנית שיפור ביצועי מובייל — מצבר הדרך (matzberimil.co.il)

מטרה: אתר מהיר בנייד. בסיס מדוד (12-13 ביוני): מובייל Performance **37**, LCP **8.0s**, TBT **1210ms**, CLS 0 (מצוין). סריקה חיה מאוחרת יותר: ~45 / LCP 8.7s / TBT 650ms / render-blocking ~1.65s / FCP 4.1s.
סטאק: WordPress + Elementor + JetEngine + The SEO Framework + WP Rocket, Cloudways (Nginx+Apache, Varnish), בעברית RTL.

## אבחנה
- LCP 8.7 + FCP 4.1 = שתי בעיות: (א) הדף מתחיל להיצבע מאוחר (render-blocking CSS + TTFB), (ב) אלמנט ה-LCP (כנראה תמונת hero) מגיע ~4.6s אחרי FCP. רוב הרווח: תמונת hero + render-blocking CSS.
- TBT = בעיית JavaScript ב-main thread (Elementor+JetEngine+מחשבון). מנופים: Defer/Delay JS, הפחתת JS של Elementor.

## אילוצים קשיחים
- אסור תוספים חדשים (פוסט-פריצה).
- סקריפט המחשבון נשבר עם "Load JavaScript deferred" ב-iOS Safari → הושבת גלובלית. חובה החרגה.
- אין Imagify API key.
- כל שינוי דורש purge Varnish ידני; בדיקת iOS Safari אמיתי (לא אמולציה) אחרי כל שינוי JS.
- אסור לשבור: מחשבון, tel:, WhatsApp.

---

## שלב 1 — ניצחונות מהירים, סיכון נמוך, Chrome (מיידי)
1. **WP Rocket → Optimize critical images (LCP)** — preload + fetchpriority=high + החרגת lazyload אוטומטית ל-LCP, פר-מכשיר. ההמלצה הכי חשובה ל-LCP. סיכון נמוך.
2. **החרגת תמונת ה-hero מ-LazyLoad לפי שם קובץ** (גיבוי ל-1; ב-Elementor חובה לפי שם קובץ, לא class).
3. **Elementor → Features/Performance:** Improved Asset Loading + Improved CSS Loading + Element Caching + Load Google Fonts Locally + Inline Font Awesome (אם בשימוש). לבדוק עיצוב אחרי. **לא** להפעיל Optimized Markup (סיכון גבוה באתר קיים).
4. **צמצום משקלי פונטים** ב-Elementor Global Fonts (להסיר משקלים/משפחות לא בשימוש).
5. **WP Rocket → Minify CSS + Minify JS** (בלי Combine — HTTP/2 פעיל).

## שלב 2 — דחיסת תמונות (Impact גבוה ל-LCP, effort בינוני)
6. להמיר את תמונת ה-hero (ותמונות מפתח) ל-**WebP במידות מובייל** (~800-1000px רוחב, איכות 75-80) דרך Squoosh.app או `cwebp` ב-SSH של Cloudways. hero טיפוסי: 400KB→~50KB. להעלות ולהחליף. דורש את שם/מיקום ה-hero מהאבחון החי.

## שלב 3 — render-blocking + TBT (סיכון בינוני, חובה בדיקות)
7. **WP Rocket → Remove Unused CSS (RUCSS)** — מסיר CSS מה-render path + font-display/preload אוטומטי. סיכון: שובר תפריטים/אנימציות Elementor → לבדוק כל תבנית, safelist. חלופה בטוחה: "Load CSS asynchronously".
8. **החזרת Defer JS + החרגת המחשבון** — הפעל "Load JavaScript deferred" + הזן את קובץ/handle המחשבון ב-Excluded JavaScript Files, או הוסף `data-nowprocket` לתג הסקריפט. מנוף TBT עיקרי. **חובה בדיקת iOS Safari אמיתי.**
9. **Delay JavaScript Execution + החרגות** (מחשבון, GA/Ads one-click). מנוף TBT הכי חזק. סיכון בינוני-גבוה → בדיקת iOS+Android, מחשבון/וואטסאפ/טלפון לפני ואחרי גלילה.
10. **JetEngine/Crocoblock + Element Manager:** כיבוי views/widgets לא בשימוש (לא הסתרה — כיבוי).

## שלב 4 — תשתית (TTFB), פאנל Cloudways / מתכן
11. **PHP 8.2/8.3 + OPcache** (TTFB).
12. **Redis Object Cache** (שירות מובנה ב-Cloudways, לא תוסף חדש) — מאיץ שאילתות JetEngine.
13. (אופציונלי) **Cloudflare חינמי** — Brotli/HTTP3/CDN. **Rocket Loader OFF** (שובר Elementor+מחשבון), Auto-Minify OFF (כפילות מול WP Rocket).

## חלוקת אחריות
- **Chrome מיד:** שלב 1 (1-5), שלב 3 (7-10) — בזהירות עם בדיקות.
- **שרת/מתכן:** שלב 2 (cwebp ב-SSH אופציונלי), שלב 4 (PHP/Redis/Cloudflare).
- **בדיקת iOS אמיתי** אחרי כל שינוי JS — מבחן האמת (הבאג המקורי לא נתפס באמולציה).

## יעד ריאלי
LCP 8.7s → ~2.5-3.5s · render-blocking 1.65s → <0.4s · FCP 4.1s → ~2s · TBT 650ms → <250ms · Performance מובייל 37/45 → 70+.

## תלוי באבחון חי (לפני ביצוע מדויק)
- שם/פורמט/משקל תמונת ה-hero + האם ב-lazyload.
- handle/נתיב סקריפט המחשבון (להחרגה).
- האם הבעיה גלובלית (תבנית/הדר) או ספציפית לדף הבית.
- גרסת PHP נוכחית + מצב Redis.
