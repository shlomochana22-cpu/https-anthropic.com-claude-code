# Brief ביצועי מובייל למתכן — מצבר הדרך (matzberimil.co.il)

מטרה: לשפר את ציון PageSpeed מובייל (תקוע ~45-50) ואת חוויית המהירות בנייד.
סטאק: WordPress + Elementor (Pro) + JetEngine/Crocoblock + The SEO Framework + WP Rocket 3.21.3, על Cloudways (Nginx+Apache, **Varnish + Redis + Memcached רצים**, PHP 8.2.30), מאחורי **Cloudflare**. בעברית RTL.

## מה כבר נעשה (דרך הפאנל, בטוח)
- preload + fetchpriority ל-hero (Elementor Custom Code "Hero Preload", post 4030, דף הבית בלבד). ה-hero הוא **תמונת רקע CSS** של קונטיינר `.elementor-element-1c9a37b` (JPEG ~71KB, `/wp-content/uploads/2025/05/WhatsApp-Image-2025-04-29-at-21.34.39.jpeg`).
- WP Rocket: LazyLoad + **"Replace YouTube iframe with preview image"** (הסיר את base.js הכבד של יוטיוב ~1.5MB), Minify CSS+JS, "Load CSS Asynchronously" מופעל.
- Cloudways: Cron Optimizer מופעל. PHP 8.2.

## ⚠️ אילוצים קריטיים (אסור לשבור)
- **המחשבון** ב-/battery-compatibility/ (+ /dev/api.php) — רגיש. **"Object Cache Pro" של Cloudways שבר אותו** (בוטל). **"Load JavaScript deferred" שובר אותו ב-iOS Safari.** כל שינוי JS/Cache → בדיקת iOS Safari אמיתי + לוודא שהבוררים נטענים.
- אסור לשבור: tel:055-5033335, WhatsApp, טופס.
- אסור תוספים חדשים בלי אישור (האתר עבר פריצה — WPCode Header רגיש).

## הבעיות שאובחנו (חי, מדויק) — לפי impact
1. 🔴 **Critical CSS לא נוצר/מוגש** — WP Rocket CPCSS תקוע "0 of 17", וה-HTML המוגש (אנונימי, גם דף הבית וגם פנימיים) **לעולם לא מכיל critical CSS** (0 async, 34-37 stylesheets חוסמים). loopback/REST/HTTP תקינים, saas מסיים לכאורה 17/17 אבל הקובץ לא שורד ב-Varnish. **render-blocking ~1,900ms.** → לתקן CCSS (regenerate דרך WP-CLI, בדיקת תקשורת ל-saas.wp-rocket.me מאחורי Cloudflare), או לעבור ל-**RUCSS (Remove Unused CSS)** עם safelist ל-Elementor + בדיקת כל תבנית, או critical CSS ידני.
2. 🔴 **LCP 7.8-10.8s** (גלובלי, בכל סוגי העמודים) — ה-hero (רקע CSS). יש preload; להוסיף המרה ל-WebP/AVIF + ולשקול הפיכתו ל-<img> עם fetchpriority (רקע CSS קשה ל-LCP).
2b. **render delay ~990ms** — נגזר מה-render-blocking CSS (סעיף 1).
3. 🟠 **TBT 320-650ms / JS כבד** — Elementor common 158KB + Lottie 71+151KB + JetSmartFilters 42KB + react-dom + swiper, נטענים **בכל העמודים גם איפה שלא בשימוש**. → Defer JS + Delay JS עם **החרגת סקריפט המחשבון** (`data-nowprocket` / Excluded JS) + GA/Ads one-click + בדיקת iOS. + conditional dequeue ל-Lottie/JetSmartFilters היכן שלא נחוץ (Element Manager / Crocoblock Performance).
4. 🟠 **פונטים: 36 וריאנטים** — Rubik (18) + Montserrat (18), כל המשקלים+italic. → לצמצם ל-2-3 משקלים במקור (Elementor Global Fonts / theme), self-host. אייקונים (dashicons/eicons/swiper) בלי font-display.
5. 🟠 **34-37 קבצי CSS חוסמים** — Elementor per-widget + per-animation CSS. → Combine CSS (HTTP/2 קיים, אז שקול) או RUCSS, או כיבוי widgets/תוספים מזריקי-CSS לא בשימוש.
6. 🟡 **3rd-party**: GTM ~600KB + GA4 חיצוני (callindex.co.il, render-blocking 1,230ms). → לאחד/לדחות.
7. 🟡 **לוגו PNG 296KB** — לדחוס ל-WebP.
8. 🟡 **TTFB cold-MISS ~1.7s** (חם ~95ms HIT) — origin render איטי (Elementor+DB). Redis רץ אך **Object Cache Pro שובר את המחשבון** — לבדוק drop-in תואם דרך WP-CLI, או לדלג. חימום קאש (preload) מקטין תדירות MISS.

## מדדים (PSI מובייל, 14-15 ביוני)
בסיס: Perf 45 · LCP 8.7s · TBT 650ms · FCP 4.1s · render-blocking ~1,870ms · CLS 0.
אחרי הטוויקים הבטוחים: נע 43-59 (רעש), render-blocking לא ירד (CCSS לא עובד). CLS 0 מצוין.

## יעד
LCP <3.5s · render-blocking <400ms · TBT <250ms · Perf 70+.
המנוף הגדול ביותר: **לפתור render-blocking CSS** (RUCSS/CCSS תקין) + **Defer/Delay JS עם החרגת מחשבון**.
