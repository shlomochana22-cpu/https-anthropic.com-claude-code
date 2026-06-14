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

---

## אבחון חי מדויק (14 ביוני, PSI מובייל Moto G / Slow 4G) — דף הבית post 1193
מובייל 45 · FCP 4.1s · LCP 8.7s · TBT 650ms · CLS 0 · SI 6.8s. TTFB ~0 (מהיר/cache). PHP 8.2.30. **מאחורי Cloudflare כבר.** Redis/Object Cache **לא פעיל**.

**שורש ה-LCP (8.7s):** אלמנט ה-LCP = קונטיינר Elementor (`.elementor-element-1c9a37b`) עם **תמונת רקע CSS** (hero JPEG, 70KB, `WhatsApp-Image-2025-04-29-at-21.34.39.jpeg`). פירוק: load delay **1,290ms** (אין preload/fetchpriority — מתגלה מאוחר) + render delay 990ms. **המשקל לא הבעיה — היעדר preload הוא הבעיה.**

**שורש המשקל (2,434KB) + TBT:** צד-שלישי דומיננטי — **YouTube embed ~1.5MB** (base.js 804KB + 457KB + 202KB) + **GTM ~600KB+** (gtag/js 601KB + עוד). צד-ראשון: לוגו PNG 296KB, lottie.min.js 151KB. + סקריפט GA4 חיצוני מ-callindex.co.il (render-blocking 1,230ms).

**Render-blocking (~1,650ms):** jquery 1,100ms · Elementor post-1193.css (זמן 10,710ms!) · jet-engine frontend.css · עשרות widget-*.css לא מאוחדים · Google Fonts (Montserrat+Rubik+Poppins, **כל המשקלים 100-900+italic**) · GA4 חיצוני.

**פונטים:** Google Fonts חיצוני (לא self-hosted), display=swap (טוב) אבל כל המשקלים. אייקונים (dashicons/eicons/swiper) בלי font-display.

## סדר עדיפויות מעודכן לפי הנתונים החיים (impact אמיתי)
1. 🥇 **preload + fetchpriority לתמונת ה-hero** (רקע CSS) — מתקן 1,290ms load delay ישירות. `<link rel="preload" as="image" href="...hero.jpeg" fetchpriority="high">` ב-head (WPCode/Elementor custom code). הכי גבוה, סיכון נמוך.
2. 🥇 **Lazy-load / facade ל-YouTube embed** — חוסך ~1.5MB + TBT ענק. אם יש סרטון בדף הבית: facade (תמונה+קליק) או lazy. הכי גבוה.
3. 🥈 **דחיית GTM + GA4 (callindex)** — Delay JS / one-click GA exclusion. TBT.
4. 🥈 **Elementor Improved CSS Loading + Improved Asset Loading** + RUCSS/async ל-post-1193.css ועשרות ה-widget CSS. render-blocking.
5. 🥈 **צמצום משקלי פונטים** ל-1-2 משקלים + self-host. + font-display לאייקונים.
6. 🥉 **Defer JS + החרגת מחשבון** (data-nowprocket) + Delay JS — TBT (בדיקת iOS).
7. **לוגו PNG 296KB → דחיסה/WebP** (גדול מדי ללוגו).
8. **Redis Object Cache** (Cloudways) — TTFB דינמי (פחות דחוף, TTFB כבר טוב).
9. **Cloudflare כבר פעיל** — לוודא Brotli ON, Rocket Loader OFF, Auto-Minify OFF.

## אבחון חי 2 — עמודים פנימיים (השוואה, 14 ביוני)
| עמוד | Perf | LCP | TBT | TTFB אמיתי |
|---|---|---|---|---|
| דף הבית | 45 | 10.8s | 610ms | ~1.8s |
| עיר ת"א | 61 | 10.4s | 50ms | ~2.3s |
| קיבולת 62 | 59 | 9.2s | 230ms | ~1.9s |
| יצרן טויוטה | 55 | 10.2s | 280ms | ~2.1s |

**מסקנות:**
- 🔴 **הבעיה גלובלית** (תבנית/הדר), לא דף הבית בלבד. LCP 9-11s בכולם.
- 🔴 **TTFB ~1.8-2.3s אחיד = page cache לא אפקטיבי!** (אמור ~200ms). ה-"0ms" ב-PSI מנורמל; Navigation Timing האמיתי ~2s. **מנוף ענק שלא זוהה קודם** — חותך ~1.8s מכל עמוד.
- ערימת JS כבדה משותפת בכל העמודים: elementor common.min.js 158KB · lottie 71KB+151KB · web-cli 45KB · swiper 44KB · react-dom 46KB · JetSmartFilters 42KB — נטענת גם איפה שלא בשימוש.
- TBT: דף הבית חריג (610ms מול 50-280 בפנימיים) — שכבת JS נוספת (YouTube+GTM+ווידג'טים).

## עדכון עדיפות-על (אחרי דיווח 2)
- 🥇🥇 **TTFB/page-cache** — לברר למה TTFB ~2s למרות WP Rocket. אם ה-page cache לא מקואש (לוגין/הגדרה/Varnish MISS) — תיקון אחד חותך ~1.8s מכל עמוד. הכי גבוה, גלובלי.
- 🥇 **Conditional loading של Lottie + JetSmartFilters** — לטעון רק היכן שנדרש (Lottie של הלוגו בהדר נטען בכל מקום). חוסך ~150-220KB JS גלובלי. "Improved Asset Loading" של Elementor עוזר חלקית.
- שאר השלבים (hero preload, YouTube lazy, פונטים, Defer/Delay) — בעינם.

## תיקון אבחון — TTFB (אנונימי, 14 ביוני)
**הקאש עובד.** אנונימי: cache-control=max-age=0 (לא no-store — ה-no-store היה ארטיפקט סשן מחובר). x-cache=HIT, **TTFB חם ~95-100ms**. ה-~2s הוא **MISS קר** (Varnish מייצר ב-~1.7s; PSI פוגע בעמוד קר). אין התנגשות תוספים, אין חוסם קאש אנונימי. WP Rocket מאציל page-cache ל-Varnish (Cloudways).
**מנופי TTFB אמיתיים:** (1) **חימום קאש** (WP Rocket Preload Cache — שפחות בקשות יהיו קרות, כולל מובייל). (2) **האצת origin** ל-MISS מהיר: Redis Object Cache + OPcache + הפחתת עומס Elementor/DB. (3) **צמצום תדירות purge** (purge מאפס את כל הקאש — היום ניקינו הרבה). (4) אופציונלי: Cloudflare Cache Rule ל-HTML אנונימי (bypass על cookie של logged-in).
**הערה:** ה-LCP load-delay (1290ms) ל-hero וה-render-delay (990ms) נפרדים מ-TTFB — preload ל-hero + הפחתת render-blocking CSS נשארים תיקוני LCP מרכזיים גם עם קאש חם.
