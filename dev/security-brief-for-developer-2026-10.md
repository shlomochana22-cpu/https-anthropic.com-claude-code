# סיכום למתכנת: ניקוי פריצה חוזרת והקשחת אבטחה, matzberimil.co.il (28/10/2026)

מצב: האתר נגוע מאז ~5/09/2026 (פריצה חוזרת אחרי אירוע יולי). Google Search Console מסמן "דפים מטעים" (Deceptive pages, Safe Browsing) מאז 23/09. 6 שבועות ללא ניקוי. כל הממצאים נאספו בקריאה בלבד מהדפדפן, בלי שינוי באתר. פירוט מלא: `security-incident-response.md`.

## א. מה יש באתר עכשיו (אומת 23/10)

**4 תוספים מזויפים פעילים** (אף אחד לא קיים במאגר וורדפרס, "עדכונים אוטומטיים מושבתים"):
1. Custom Fields Pro 3.8.1, "Dev Squad", תיקייה `custom-fields-pro-169`. מכיל `js/bsc-loader.js` ורושם AJAX handler `bsc_sl_get_script` שמגיש את הקוד. זה ה-backdoor בפועל.
2. Attention Toolkit 0.2.3, "Attention Creative". משנה גם את מסך ההתחברות.
3. Archive Title Fix 2.1.5, "Maple Digital".
4. Integrity Scanner 2.4.0, "Secure Solutions", תיקייה `integrity-scanner-24`. **הוסר ב-13/10 (לא ידוע על ידי מי) וחזר להיות פעיל ב-23/10** → קיים מנגנון התקנה מחדש.

**הזרקות חיות** (עמוד המחשבון /battery-compatibility/ ועוד): `cdn.quickdelivr.com/mpackage.js` פעמיים (הגשה מותנית, cloaking לפי user-agent/הפניה), `bsc-loader.js` + 3 מופעי `bsc-sl-loader`, ו-**POST חי ל-`bsc-testnet.bnbchain.org`** ו-`bsc-testnet-rpc.publicnode.com` (טכניקת EtherHiding: כתובת ה-payload נמשכת מחוזה חכם, אי אפשר לחסום מקור).

**תוסף לגיטימי שנעלם:** WPCode Lite הוסר (לא מותקן בכלל). לברר מי הסיר. אם לא אתה או NY, זו הסרה על ידי התוקף.

**תצורה:** display_errors פעיל; WP_MEMORY_LIMIT 40M (PHP 1024M); PHP 8.2.33; 3 תוספי קאש פעילים במקביל (WP Rocket, Breeze, WP Fastest Cache); WP File Manager מותקן ומכובה (כלי תקיפה קלאסי, לברר מי התקין); DISABLE_WP_CRON מוגדר. mu-plugins: `advanced-cache.php`, `maintenance.php` (ביולי נראו תקינים, לבדוק שוב).

**היסטוריה רלוונטית (יולי):** backdoor בשני תוספים מזויפים (Changelog Notifier, Category Order Easy) שיצר אדמין נסתר `sys_maint` (meta `_wp_ip`, option `_wp_ip_id`), עם cloaking מאדמינים. IOC: `sys@localhost.local`, `WP_IP_LOGIN/EMAIL/PASS/META`. כתובות IP של התוקף: 2601:80:477c:f2a0::/64, 35.146.121.182, 47.17.67.236, 68.238.49.241, 104.13.34.25, 172.98.32.194, 168.144.167.238. ווקטור חשוד: Complianz GDPR עם פגיעות מוכרת, ומחשב שהריץ נוזקת ClickFix.

## ב. ניקוי, בסדר הזה, במושב אחד (לא ניקוי חלקי)

1. **גיבוי מלא** (קבצים + DB) לפורנזיקה, לפני כל נגיעה. לרשום תאריכי יצירה/שינוי של 4 תיקיות התוספים.
2. **מחיקת 4 התוספים** דרך SFTP/File Manager של Cloudways (מחיקת תיקיות, לא השבתה מהממשק, השבתה מריצה את הקוד שלהם). למחוק גם WP File Manager.
3. **חיפוש שרידים ומנגנון ההתקנה החוזרת:** `wp-content/mu-plugins/`, `wp-config.php`, `.htaccess`, `functions.php` של התבנית (מכיל פילטר sitemap לגיטימי שלנו, `the_seo_framework_sitemap_additional_urls`, לא למחוק), קבצי PHP ב-`wp-content/uploads/`, drop-ins, אירועי wp_cron לא מוכרים, `wp_options` עם ערכים base64/eval, application passwords, מפתחות SFTP/SSH ב-Cloudways. בלי לסגור את הכניסה, הניקוי יחזור על עצמו (קרה כבר פעמיים).
4. **grep בכל הקוד וה-DB:** `quickdelivr`, `bsc-loader`, `bsc_sl`, `bsc_sl_get_script`, `bsc-testnet`, `mpackage`, `publicnode`, `bnbchain`, `_wp_ip`, `sys_maint`, `sys@localhost`, `WP_IP_`.
5. **משתמשים:** לוודא שאין אדמין נסתר (גם דרך SQL ישיר ב-wp_users/wp_usermeta, כי ביולי האדמין הוסתר מ-users.php ומ-REST). אדמינים לגיטימיים: `matzberimil`, `NY.media.ltd@gmail.com` (חברת הקידום). לשקול הורדת NY ל-Editor.
6. **רק אחרי מחיקת הקבצים:** סיבוב Salts ב-wp-config (ניתוק כל הסשנים) + החלפת כל הסיסמאות: וורדפרס (כל המנהלים), Cloudways, SFTP, DB. 2FA לכל המנהלים. (החלפת סיסמאות לפני מחיקת הקוד חסרת ערך, ה-backdoor משחזר גישה.)
7. **עדכונים:** Complianz GDPR (ווקטור חשוד), JetEngine, JetSmartFilters, Elementor Pro, UpdraftPlus, וורדפרס.
8. **אימות ניקוי כגולש אנונימי**, גם עם user-agent של מובייל וגם עם Referer מגוגל (הסקריפט מוגש מותנה): אפס מופעים של המחרוזות בסעיף 4 ב-HTML, אפס בקשות רשת ל-quickdelivr/bnbchain/publicnode, גודל דף הבית סביר (~440KB, לא ~680KB), 0 תוספים לא מזוהים.
9. **אז ורק אז:** ב-GSC לחיצה על "בקשה לבדיקה" (Request Review) עם תיאור קצר של הניקוי. בקשה לפני ניקוי נכשלת ומאריכה את הסימון. אחרי כן "אמת תיקון" על קבוצת ה-5xx.

## ג. הקשחה אחרי הניקוי

- **לא להתקין תוספי אבטחה** (כלל האתר; Wordfence לא זיהה כלום ביולי). במקום: Cloudflare WAF: חסימת `/xmlrpc.php`, rate-limit ל-`wp-login.php` ו-`wp-admin`, Bot Fight Mode כבוי (חוסם סורקי AI לגיטימיים), AI crawlers = Allow, Rocket Loader כבוי.
- **wp-config:** `DISALLOW_FILE_EDIT`, `DISALLOW_FILE_MODS` (אין התקנת תוספים מהממשק, מתאים לכלל האתר), display_errors כבוי, WP_MEMORY_LIMIT 256M, DISABLE_WP_CRON עם cron שרת אמיתי (5 משימות באיחור, גיבויי UpdraftPlus לא רצים).
- **תוסף קאש אחד** (Breeze), מחיקת WP Rocket ו-WP Fastest Cache, ומחיקת drop-ins מיותרים.
- **robots.txt** (טקסט מוכן ב-`quick-wins-2026-10.md`): חסימת `?nocache=` (96 מ-105 שגיאות 5xx בספטמבר), `/dev/api.php`, `/feed/`, `/xmlrpc.php`; Allow מפורש לסורקי AI; שורת Sitemap.
- **הפניית 301** `matzberimil.co.il/review` → `https://g.page/r/CZNXhUIXIrZ4EBM/review` (לבקשות ביקורות).
- **Bing Webmaster Tools:** רישום וייבוא מ-GSC (רק אחרי הסרת הסימון בגוגל).
- **ניטור:** גיבוי יומי שעובד, סריקת integrity של קבצי core/plugins (wp-cli `core verify-checksums` + `plugin verify-checksums`), התראה על תוסף חדש או אדמין חדש.
- **חובת דיווח:** ה-DB (כולל לידים) נחשף כנראה פעמיים. לשקול חובות לפי חוק הגנת הפרטיות.

## ד. מה אנחנו עושים אחריך
אימות אנונימי מלא מהדפדפן (סעיף ב-8), "בקשה לבדיקה" ב-GSC, "אמת תיקון" על 5xx, רישום Bing, והחזרת מדידת מהירות.
