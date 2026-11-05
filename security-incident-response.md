# תגובת אירוע אבטחה, מצבר הדרך (matzberimil.co.il)

עודכן: יוני 2026, אחרי דוח חקירת Claude כרום.

## עדכון סגירה: האירוע טופל ונסגר (10 יוני 2026) ✅

בוצע במלואו דרך Claude בכרום + Cloudways:
- גיבוי מלא (UpdraftPlus) לפני התחלה.
- נמחקו כל הקבצים/התיקיות הזדוניים: tji-site-js.php (mu-plugin), wp-default-deployer-modified (backdoor), hello-elementor/css.js (סקימר), theme-js-modifier, theme-js-wpcode, wpallpro.zip.
- תבנית האם Hello Elementor הותקנה מחדש נקייה; הוסרו 4 בלוקי tji-theme-inline-js מ-header.php/footer.php של תבנית הבן.
- נוטרלו הזרקות WPCode (Footer + סניפט; התוסף הושבת).
- נמחקו 3 מנהלים זדוניים (seobackup, dev_ijeiawo7, cloudhdigital), התוכן יוחס ל-matzberimil.
- עודכנו תוספים פגיעים (JetSmartFilters קריטי, JetEngine, JetTabs, Elementor Pro, Breeze, Classic Editor).
- אומת: 0 סמני זדון (performance_optimizer_v6 / atob / tji / css.js) בדף הבית ובעמוד עיר.
- סיבוב סיסמאות מלא: Salts (WordPress), Cloudways Master (SSH/SFTP שרת), סיסמת אפליקציה, סיסמת DB, סיסמת חשבון Cloudways.
- סקירת Cloudways: אין משתמשי SSH/SFTP נוספים, אין מפתחות SSH מושתלים, חבר חשבון יחיד, יומן נקי.
- סריקת Wordfence סופית נקייה (0 Critical, 0 malware; נותרו רק התראות "modified theme file" תקינות על תבנית הבן), סריקה שבועית אוטומטית הופעלה.
- האתר הוחזר מתחזוקה לאוויר (HTTP 200), cache נוקה.

מעקב מומלץ: 2FA ב-Cloudways וב-wp-admin; מחיקת הגיבוי שלפני הניקוי אחרי כמה ימי יציבות; העברת בעלות האחסון/דומיין לבעל העסק (כרגע על שם המתכן).

## מצב (לפני הטיפול, לתיעוד)

הפריצה פעילה ומשחזרת את עצמה (reinfection). אומת:
- קוד זדוני (RCE בצד-לקוח) שמוריד ומריץ JavaScript שרירותי מ-ntdnewtds.shop / dnsnewtds.shop, מוסתר ב-base64, חתימת תוקף "tji-".
- מושתל ב-6 מקומות: WPCode header+footer (אופציות ihaf_insert_header/footer ב-wp_options), וגם header.php + footer.php של תבנית הבת ושל תבנית האם (Hello Elementor).
- שני חשבונות מנהל זדוניים חזרו: seobackup, dev_ijeiawo7. חזרתם = יש מנגנון התמדה (backdoor) שמשחזר.
- Wordfence לא מותקן. אין סורק זמין.

מסקנה: ניקוי ה-JS בלבד לא יספיק. חייבים למצוא ולחסל את ה-backdoor ולסובב את כל הסיסמאות, אחרת זה יחזור.

## העובדה הקריטית: כנראה יש גישה ברמת קבצים / אחסון

הקוד מושתל ישירות בקבצי התבנית (header.php/footer.php), לא רק ב-DB. שינוי קבצים כזה מצביע על גישת כתיבה לקבצים (SFTP/SSH/אחסון), או על backdoor PHP שכותב אותם. לכן:

פעולות בעלים דחופות (רק אתה יכול, לא Claude כרום):
1. החלף עכשיו את סיסמת Cloudways (Master) ואת סיסמאות ה-SFTP/SSH של האפליקציה.
2. ב-Cloudways: בדוק Application -> SSH/SFTP Access ורשימת חברי צוות, והסר כל גישה/משתמש שאינך מזהה.
3. בדוק Access/Audit Logs ב-Cloudways לאיתור כניסות חשודות.
4. החלף את סיסמת ה-DB (ועדכן את wp-config.php בהתאם) ואת סיסמאות כל מנהלי הוורדפרס.
5. החלף את ה-Salts ב-wp-config.php (מפיל את כל הסשנים של התוקף).

בלי השלב הזה, כל ניקוי באתר יחזור. זה כנראה שורש הבעיה.

## אופציה לשקול: שירות הסרת זדוניות מקצועי

המתכנת הקודם כבר ניסה לנקות והפריצה חזרה. פריצות מתמשכות עם גישת קבצים קשות לעקירה. שווה לשקול Wordfence Care / Sucuri (הסרה + אחריות) במקביל. אפשר גם לעשות לבד לפי התוכנית למטה, אבל זו ההמלצה אם זה חוזר שוב.

## הכרעת חשבונות מנהל (אושר ע"י הבעלים)

| משתמש | החלטה |
|---|---|
| matzberimil | לשמור (הבעלים) |
| NY.media.ltd@gmail.com | לשמור (אושר ע"י הבעלים) |
| Tsahi (Tsahi123344) | לשמור (אושר ע"י הבעלים) |
| seobackup | למחוק (זדוני) |
| dev_ijeiawo7 | למחוק (זדוני) |
| cloudhdigital@gmail.com | למחוק (לא זוהה ע"י הבעלים) |

הערה: גם לשלושת החשבונות שנשמרים יש לאפס סיסמה ולהפעיל 2FA, כי האתר היה פרוץ ויתכן שנגנבו פרטיהם. כדאי לוודא עם NY.media ו-Tsahi שהם מזהים פעילות בחשבונם.

## סדר תגובת אירוע (לא לנקות חלקית!)

שלב א, גיבוי פורנזי: גיבוי מלא (קבצים + DB) לפני שנוגעים, לשמירת ראיות ולשחזור.

שלב ב, מיפוי מלא (לפני ניקוי): למצוא את כל נקודות ההדבקה ואת מנגנון ההתמדה, לא רק את 6 הידועות. ראה "משימת מיפוי" למטה.

שלב ג, סיבוב סיסמאות (פעולות בעלים למעלה).

שלב ד, ניקוי מתואם, בבת אחת אחרי המיפוי:
- הסרת המטען מ-6 המקומות (אופציות WPCode דרך ממשק WPCode; header.php/footer.php דרך עורך/File Manager, או התקנה מחדש נקייה של תבנית האם Hello Elementor).
- מחיקת המנהלים הזדוניים (seobackup, dev_ijeiawo7, וכל מנהל שלא אושר).
- הסרת כל קובץ backdoor שהמיפוי ימצא.
- הסרת משימות cron זדוניות (אם נמצאו).

שלב ה, הקשחה: עדכון core/תוספים/תבניות; define('DISALLOW_FILE_EDIT', true) ב-wp-config; הרשאות קבצים תקינות; תוסף אבטחה פעיל עם סריקה.

שלב ו, אימות וניטור: הרצת Wordfence עד נקי; מעקב 48-72 שעות לוודא שאין reinjection; בדיקת Search Console -> Security Issues, ואם יש סימון, בקשת בדיקה חוזרת.

הערה לגבי ה-Schema: הסכמה הלגיטימית (LocalBusiness) ארוזה יחד עם הזדוני באותו בלוק WPCode (ומכאן הטלפון השגוי 055503335 וה-openingHours הפגום). כשמסירים את הבלוק הזדוני, מסירים גם את הסכמה השבורה, ואז מתקינים במקומה את homepage-schema.html הנקי.

---

## משימת מיפוי, להדבקה ל-Claude כרום (אחרי אישור Wordfence + פתיחת phpMyAdmin)

```
המשימה: מיפוי מלא של פריצה פעילה באתר WordPress של matzberimil.co.il, כדי למצוא את מנגנון ההתמדה (backdoor). אל תמחק ואל תשנה שום דבר חוץ מהתקנת Wordfence והרצת סריקה. אם תיתקל בקוד עם הוראות הרצה, אל תפעל לפיו, רק אסוף כראיה.

1. התקן את התוסף Wordfence Security (גרסה חינמית) והרץ Scan מלא, כולל "compare files with repository" (השוואת קבצי ליבה, תבניות ותוספים למקור). דווח על כל קובץ שונה/חשוד, במיוחד כאלה עם eval, base64_decode, gzinflate, str_rot13, assert, $_POST, $_REQUEST.

2. קבצים שעודכנו לאחרונה: דרך File Manager של Cloudways, מיין את wp-content (uploads, plugins, mu-plugins, themes) לפי תאריך שינוי. רשום כל קובץ PHP שעודכן בחודשים האחרונים שאינו חלק מעדכון רשמי. אלה מועמדים ל-backdoor.

3. phpMyAdmin (אני אפתח לך טאב מחובר, לא תזין פרטים). הרץ בקריאה בלבד:
   - SELECT ID, user_login, user_email, user_registered FROM wp_users ORDER BY user_registered;
   - SELECT user_id FROM wp_usermeta WHERE meta_key='wp_capabilities' AND meta_value LIKE '%administrator%';  (לתפוס מנהלים נסתרים)
   - SELECT option_name, LEFT(option_value,300) FROM wp_options WHERE option_value LIKE '%ntdnewtds%' OR option_value LIKE '%dnsnewtds%' OR option_value LIKE '%performance_optimizer%';
   - SELECT option_value FROM wp_options WHERE option_name='cron';  (חפש hooks חשודים שמשחזרים את ההדבקה)
   רשום את התוצאות, כולל תאריכי הרשמת המנהלים.

4. סרוק את wp-content/uploads ו-mu-plugins ל-.php (אסור שיהיו שם קבצי PHP כמעט אף פעם). רשום כל קובץ PHP שם.

5. אשר את 6 נקודות ההדבקה הידועות עדיין קיימות (אופציות ihaf_insert_header/footer, ו-header.php/footer.php של תבנית הבת והאם).

החזר דוח: (א) קבצים מודבקים/חשודים מ-Wordfence, (ב) קבצים שעודכנו חשוד, (ג) תוצאות ה-DB כולל תאריכי מנהלים ו-cron, (ד) קבצי PHP ב-uploads/mu-plugins. ואז עצור, אל תמחק כלום, ונחליט יחד על ניקוי מתואם.
```

## 28/07/2026 — 🚨 דלת אחורית פעילה התגלתה: שאריות פריצת יולי לא נוקו
- **הממצא (מפעיל-כרום, סריקת תוספים):** שני תוספים מזויפים פעילים עם אותו קוד — "Changelog Notifier" (Orbit Works 2.9.1) ו-"Category Order Easy" (Site Tools Team 3.0.0). קוד עם קונסטנטות בהקסה שמתפענחות ל-sys_maint / sys@localhost.local / סיסמה קבועה; יוצר/משחזר משתמש אדמין נסתר (מטא _wp_ip); הערה בקוד: "Safe for redeploy: several copies of this plugin may be active at once" — מתוכנן לשרוד הסרה של עותק בודד.
- **אישוש:** Really Simple Security מדווח על אדמין בשם sys_maint (לצד matzberimil ו-NY.media.ltd@gmail.com — זהות אחרון טעונה אישור בעלים).
- **סטטוס:** לא בוצעה שום פעולה עדיין (המפעיל לא נגע). תוכנית ניקוי נמסרה לבעלים — ראה סדר פעולות מטה. חשד לוקטור: המחשב השני שהריץ את נוזקת ClickFix ביולי — אם לא פורמט, הוא מקור ההדבקה החוזרת.
- **סדר הניקוי (חובה בסדר הזה):** (1) איסוף ראיות read-only. (2) איתור כל העותקים לפני מחיקה (חיפוש בקבצי plugins/mu-plugins). (3) מחיקת כל העותקים בו-זמנית דרך SFTP/File Manager של Cloudways — לא דרך wp-admin. (4) מחיקת המשתמש sys_maint (שיוך תוכן ל-matzberimil) + אימות שאר האדמינים. (5) החלפת כל הסיסמאות + סיבוב Salts (תוסף Salt Shaker קיים) = ניתוק כל הסשנים. (6) סיבוב סיסמאות Cloudways/SFTP/DB + בדיקת SSH keys/חברי צוות זרים. (7) סריקת Wordfence מלאה ברגישות גבוהה + בדיקת קבצי php ב-uploads + בדיקת cron jobs. (8) אימות בעלי GSC/GBP. (9) פורמט/סריקה של המחשב הנגוע מיולי אם טרם בוצע.
- **עדכון בעלים (28/07):** NY.media.ltd@gmail.com אושר — חברת הקידום של הבעלים, אדמין לגיטימי. האדמין הזר היחיד: sys_maint. הערה: גם הסיסמה של NY.media מוחלפת בשלב 3 (לתוקף הייתה גישה לכל החשבונות).

## 28/07/2026 — דוח ראיות מלא (מפעיל-כרום, read-only)
- **היקף:** 2 עותקי הדלת האחורית בלבד (changelog-notifier/, category-order-easy/ — קובץ בודד כ"א, 125KB, קוד זהה). נסרקו כל 33 התוספים + child-theme — נקיים. אין mu-plugins. לא כוסה (דורש SFTP): theme אב, uploads, drop-ins (advanced-cache.php, maintenance.php), wp-config.
- **מנגנון:** יוצר/משחזר אדמין sys_maint (ID 9, סיסמה קבועה ChangeMe_Str0ng!, option _wp_ip_id, meta _wp_ip) בכל טעינה; מסתיר אותו מ-users.php ומ-REST (pre_user_query/rest_user_query — אומת חי: "מנהל (3)" אבל 2 בטבלה); מזריק 2 בלוקי script (סה"כ ~240KB, 10,662 טוקנים מוסתרים) לכל גולש אנונימי/סורק, עם cloaking מלא מאדמינים מחוברים. עמידות: function_exists + WP_IP_HOOKS — עותקים משחזרים זה את זה.
- **🚨 ההזרקה פעילה עכשיו** (אומת אנונימית בדף הבית, עמוד המחירים, עמוד דגם) — 35% מ-HTML דף הבית. הסבר סביר לצניחת המובייל ב-GSC (מדורגת מ-4-6/7, נייד בלבד).
- **פעילות תוקף (Wordfence Live Traffic):** כניסות sys_maint מוצלחות: 12/7 (NJ), 13/7 (TX), **27/7 01:44+01:47 (NJ+VT בהפרש 3 דק' = פרוקסי)**. כניסת "Tsahi" מוצלחת 4/7 מארה"ב (המשתמש נמחק מאז; ניסיונות Tsahi כושלים מפ"ת 10/7, 12/7, 22/7 — ייתכן שהאמיתי ננעל בחוץ). ID 1 נמחק. 24/7 ניסיונות shells+Gravity SMTP (נחסמו), 28/7 brute-force (נחסם).
- **Wordfence החמיץ הכל** (חתימות Community בעיכוב 30 יום; כל 26 אופציות הסריקה דלוקות). ממצאי סריקה רלוונטיים: Complianz GDPR פגיעות מוכרת (חשוד כווקטור כניסה), JetEngine/JetSmartFilters/WP Rocket/Elementor Pro/UpdraftPlus דורשים עדכון. WP File Manager 8.0.4 מותקן ומכובה ("כובה לאחרונה") — כלי תקיפה קלאסי, לברר מי התקין.
- **אף אדמין ללא 2FA.** חשיפת DB (כולל לידים) — להניח שנחשף; לשקול חובות דיווח לפי חוק הגנת הפרטיות.
- **IOC לרישום:** IPs: 2601:80:477c:f2a0::/64 (NJ), 35.146.121.182, 47.17.67.236, 68.238.49.241, 104.13.34.25, 172.98.32.194, 168.144.167.238. סמנים: _wp_ip, WP_IP_LOGIN/EMAIL/PASS/META, sys@localhost.local, option _wp_ip_id.
- **סדר ביצוע מעודכן (קריטי — קודם קבצים, אחר כך סיסמאות):** גיבוי ראיות (UpdraftPlus קיים) → מחיקת 2 תיקיות התוספים בו-זמנית ב-SFTP/File Manager → מחיקת WP File Manager → מחיקת sys_maint (ID 9) + option _wp_ip_id + meta → סיבוב Salts (ניתוק sessions) + החלפת כל הסיסמאות (וורדפרס×3, Cloudways, SFTP, DB) + 2FA לשלושתם → אימות HTML אנונימי נקי → עדכון Complianz + כל התוספים הפגיעים → סריקה חוזרת + בדיקת uploads/drop-ins/wp-config ב-SFTP → GSC Security Issues.
- **הנימוק לסדר:** החלפת סיסמאות לפני מחיקת הקבצים חסרת ערך — הדלת האחורית משחזרת את sys_maint עם סיסמה קבועה בכל טעינה. חייבים להסיר את הקוד קודם, ואז לנעול הכל, במושב אחד.

## 28/07/2026 (המשך) — שלב 0 בוצע; ביצוע הניקוי עבר לבעלים
- **גיבוי מלא הצליח (13:58-13:59):** DB 17.46MB + קבצים, סה"כ ~201MB, כל הרכיבים הורדו למחשב, הגיבוי סומן "מחיקה ידנית בלבד". ⚠️ DISABLE_WP_CRON מוגדר + 5 משימות מתוזמנות באיחור — גיבויים אוטומטיים כנראה לא רצים (לטפל אחרי האירוע).
- **מפעיל-כרום סירב (בצדק) לבצע מחיקות/שינויי גישה** — נמסר לבעלים צ'קליסט מדויק. סדר מתוקן (של המפעיל): Salt Shaker → קישורי איפוס לשני המנהלים → מחיקת 2 תיקיות התוספים בו-זמנית (עדיף Cloudways SFTP; חלופה: WP File Manager מופעל-ומוחק-מיד) → אימות 33→31 תוספים → מחיקת sys_maint ID 9 (מבחן הצלחה: "מנהל (2)" = 2 שורות בטבלה) → אופציונלי delete_option('_wp_ip_id') ב-WPCode.
- **ממצאי טוהר (דרך Browse contents של הגיבוי, בלי להפעיל File Manager):** drop-ins תקינים (advanced-cache.php 3.8KB, maintenance.php 2.4KB — גדלים נורמליים של WP Rocket); uploads נקי (11 קבצי php — כולם index.php ריקים + functions.php 0 בייט של wpallimport); אין mu-plugins היום. **ממצא צדדי:** גיבוי מ-10/06/2026 כלל רכיב "Must-use plugins" שכבר לא קיים ולא ניתן לבדיקה — ביוני היו mu-plugins.
- **מדדי "לפני" לאימות הניקוי:** דף הבית 683,207B / מחירים 632,893B / קאמיק 495,936B — כולם עם 10,662 טוקני _0x. יעד אחרי: 0 טוקנים, דף בית ~440KB.
- **ממתין:** ביצוע הצ'קליסט ע"י הבעלים → שלב 4 של המפעיל (עדכוני תוספים כולל Complianz, אימות אנונימי, Wordfence, GSC). פתוח בהמשך: סיסמאות Cloudways/SFTP/DB, 2FA, בירור Tsahi, חשיפת לידים.

## 17/09/2026 — ⚠️ ממצא לבדיקה: סקריפטים לא מזוהים בעמוד המחשבון
- מפעיל-כרום (recon סיאט/הונדה, read-only) הבחין שעמוד המחשבון (/battery-compatibility/) טוען: (1) `cdn.quickdelivr.com/mpackage.js` פעמיים - דומיין CDN לא מוכר; (2) `/wp-content/plugins/custom-fields-pro-169/js/bsc-loader.js` - **התיקייה custom-fields-pro-169 לא הופיעה ברשימת 33 התוספים מסריקת 28/07** (הדפוס של הדלת האחורית הקודמת: קוד מחוץ לרשימת התוספים).
- **סטטוס:** לא נגענו. הועבר לבעלים → מתכנת לבדיקה דחופה, קריאה בלבד קודם: האם התיקייה קיימת ב-SFTP, תוכן bsc-loader.js, מי מזריק את ה-CDN (theme/plugin/DB option), האם quickdelivr לגיטימי. אם זדוני - אותו פרוטוקול ניקוי כמו 28/07 (גיבוי → מחיקה ב-SFTP → סיסמאות/Salts → סריקה).

## עדכון 17/09/2026 - בעיית שרת מול Googlebot (ייתכן קשור, ייתכן לא)
- GSC Crawl stats: Server connectivity אדום מ-5-6/09 (20-30% בקשות סריקה נכשלות), 105 כתובות 5xx (96 עם ?nocache=), sitemap לא נקרא 31/08-17/09.
- מקור ה-?nocache= לא ידוע - 96 כתובות כאלה הגיעו לגוגל, כלומר משהו באתר מייצר אותן. יחד עם הממצא של cdn.quickdelivr.com/mpackage.js + custom-fields-pro-169/js/bsc-loader.js (תיקייה שאינה ברשימת התוספים) - לבדוק אם מדובר בהדבקה חוזרת. סיכום מלא למתכנת: dev/server-5xx-brief-2026-09.md.

## 🚨 17/09/2026 (ערב) - עדות חזקה להדבקה פעילה / חוזרת
**נאסף מכרום, קריאה בלבד, שום דבר לא שונה באתר.**

### ראיות
1. **4 תוספים פעילים לא מזוהים** (אף אחד לא קיים במאגר וורדפרס, "עדכונים אוטומטיים מושבתים" בכולם - דפוס של תוספים מושתלים):
   - Custom Fields Pro 3.8.1 "מאת Dev Squad" → תיקייה `custom-fields-pro-169`
   - Integrity Scanner 2.4.0 "מאת Secure Solutions"
   - Attention Toolkit 0.2.3 "מאת Attention Creative"
   - Archive Title Fix 2.1.5 "מאת Maple Digital"
2. **`/wp-content/plugins/custom-fields-pro-169/js/bsc-loader.js`** (1,058 בייט) מוטבע ע"י וורדפרס עצמו בפוטר של עמוד המחשבון (handle `bsc-sl-loader-js`). מיד אחרי הטעינה הדפדפן שולח POST ל-RPC של בלוקצ'יין BSC Testnet: `bsc-testnet-rpc.publicnode.com` (503) ו-`bsc-testnet.bnbchain.org` (200). **טכניקת EtherHiding**: ה-loader מושך את כתובת ה-payload מחוזה חכם, כך שאי אפשר לחסום את המקור. אותה משפחה כמו ההדבקה מיוני-יולי.
3. **`cdn.quickdelivr.com/mpackage.js`** פעמיים ב-head של עמוד המחשבון. חזר 0 בייט בטעינה הנוכחית - כנראה הגשה מותנית (cloaking לפי user-agent / IP / זמן).
4. **תקינות האתר:** display_errors פעיל (חשיפת מידע); WP_MEMORY_LIMIT 40M מול PHP 1024M; PHP 8.2.33.
5. **תזמון:** אין עריכות תוכן ב-4-7/09 (אפס). השינוי סביב 5-6/09 הוא ברמת שרת/תוסף. השערה: פעילות התוספים (או payload שהם מושכים) מעמיסה על השרת ומפילה 20-30% מבקשות Googlebot.
6. **ממצא לא זדוני שנסגר:** מקור ה-`?nocache=` הוא JetEngine (`JetEngineSettings.ajaxlisting` = URL העמוד + `?nocache=1` בכל עמוד). גוגל קורא URL-ים ממחרוזות JS. פתרון: `Disallow: /*?nocache=` ב-robots.txt (משימת מתכנת, לא דחוף).

### רשימת פעולות למתכנת (בסדר הזה)
1. **גיבוי מלא** (קבצים + DB) לפני כל נגיעה, לצורך פורנזיקה.
2. **להסיר את 4 התוספים** לעיל (מחיקת התיקיות, לא רק השבתה). לפני המחיקה: לרשום תאריכי יצירה/שינוי של הקבצים ולהשוות ל-5-6/09 ולתאריכי הניקוי מיולי.
3. **לחפש שרידים:** `wp-content/mu-plugins/`, WPCode snippets (שם יושבת גם הסכמה הלגיטימית של האתר - לא למחוק אותה), `wp-config.php`, `.htaccess`, `functions.php` של התבנית (מכיל את פילטר ה-sitemap הלגיטימי מ-dev/sitemap-capacity-filter.php - לא למחוק), קבצי PHP בתוך `wp-content/uploads/`, אירועי wp_cron לא מוכרים, `wp_options` עם ערכים מקודדי base64.
4. **משתמשים:** לוודא שאין משתמש admin נסתר (ביולי היה `sys_maint`). לבדוק גם application passwords.
5. **grep בכל האתר** ל-`quickdelivr`, `bsc-loader`, `bsc-testnet`, `mpackage`, `publicnode`, `bnbchain`.
6. **סיבוב סיסמאות מלא** אחרי הניקוי: וורדפרס (כל המנהלים), Cloudways, SFTP, DB, ו-salts ב-wp-config.
7. **איך נכנסו שוב:** מכיוון שהאתר נוקה ביולי והדבקה חזרה, יש כניסה שלא נסגרה: משתמש/סיסמה שלא הוחלפו, backdoor בקובץ שלא זוהה, תוסף/תבנית פגיעים, או מפתח SFTP. בלי לסגור את זה - הניקוי יחזור על עצמו.
8. **Cloudways:** access logs לבקשות Googlebot 5-16/09, גרף CPU/זיכרון, ו-error logs לאותם תאריכים.
9. **אחרי הניקוי:** לכבות display_errors, להעלות WP_MEMORY_LIMIT (256M), `Disallow: /*?nocache=` ו-`Disallow: /dev/api.php` ב-robots.txt.
10. **אז ורק אז** - "אמת תיקון" על קבוצת ה-5xx ב-GSC ומעקב ש-Host status חוזר לירוק.

### מה לא לעשות
- לא להתקין תוסף אבטחה (הכלל הקיים). Wordfence/דומיו לא היו מונעים את זה ורק מוסיפים משטח.
- לא להשבית תוספים דרך הממשק לפני גיבוי - ההפעלה/השבתה מריצה קוד של התוסף.

## 22/09/2026 - אימות: ההדבקה פעילה ברגע זה
- **תוספים:** Custom Fields Pro, Attention Toolkit, Archive Title Fix - קיימים ופעילים. **Integrity Scanner - הוסר** (לא ידוע ע"י מי; לשאול את המתכנת. אם לא הוא - התוקף מנקה אחריו). 21 תוספים בסך הכל.
- **מחשבון (/battery-compatibility/):** quickdelivr x2 (head+body, `<script async src="https://cdn.quickdelivr.com/mpackage.js">`), bsc-loader x1, bsc-sl-loader x3. הסקריפט נטען דרך **admin-ajax עם action `bsc_sl_get_script`** (כלומר התוסף רושם AJAX handler שמגיש את הקוד - זה ה-backdoor בפועל). **Network: POST חי ל-bsc-testnet.bnbchain.org.** לא שריד - פעיל.
- **משתמשים מנהלים:** `matzberimil` (s@matzberimil.co.il) ו-`NY.media.ltd@gmail.com` (0 פוסטים). השני = חברת הקידום של הבעלים (NY, ידוע). עדיין: חשבון מנהל של צד שלישי עם 0 פוסטים = וקטור כניסה אפשרי. לכלול בסיבוב הסיסמאות, ולשקול הורדה ל-Editor.
- **חלון ה-5xx נסגר ב-18/09 בלי ניקוי** - כלומר השרת נרגע מעצמו והתוקף עדיין בפנים. הבעיה תחזור.
- **GSC:** אימות תיקון על 5xx התחיל 22/09 (בטעות גם על קבוצת noindex 235 - לא מזיק, ייכשל ולא ישנה דבר).
- **תוספת לרשימת הפעולות למתכנת:** grep גם ל-`bsc_sl_get_script` ו-`bsc_sl` בכל הקוד (תוספים, תבנית, mu-plugins, wp_options). ולברר מי הסיר את Integrity Scanner.

## 🚨🚨 23/09/2026 - Google Search Console: "דפים מטעים" (Deceptive pages)
- **מה:** GSC → אבטחה ופעולות ידניות → "בעיות אבטחה: זוהתה בעיה אחת", סוג **Deceptive pages** (Social Engineering). כתובות לדוגמה: "לא זמין" (גוגל לא חשפה).
- **משמעות עסקית:** Google Safe Browsing. Chrome, Firefox, Safari ואנדרואיד עלולים להציג **מסך אזהרה אדום** ("האתר שלפניך מכיל תוכנה מזיקה / אתר מטעה") לכל גולש שנכנס לאתר. בתוצאות החיפוש עשויה להופיע תווית "אתר זה עלול להזיק למחשב". זה פוגע ישירות בשיחות ובהמרות, לא רק בדירוג.
- **סיבה כמעט ודאית:** ההזרקה הפעילה (EtherHiding דרך bsc-loader + cdn.quickdelivr.com/mpackage.js המוגש מותנה). סקריפטים כאלה מציגים לגולשים מסוימים (לפי מדינה/מכשיר/הפניה) הודעות מזויפות ("עדכן את הדפדפן", "הדפדפן נגוע") - זו בדיוק ההגדרה של Deceptive pages.
- **סדר פעולות מחייב:**
  1. המתכנת מנקה לפי רשימת 10 הפעולות (סעיף 17/09 ערב) וסוגר את דרך הכניסה.
  2. אימות שאין שרידים: אפס מופעים של quickdelivr / bsc-loader / bsc_sl_get_script / publicnode / bnbchain בכל האתר, 3 התוספים המזויפים נמחקו, כל העמודים נטענים בלי בקשות חיצוניות חשודות (בדיקה גם עם user-agent של מובייל ועם הפניה מגוגל - הסקריפט מוגש מותנה).
  3. **רק אז** לוחצים ב-GSC "בקשה לבדיקה" (Request Review) עם תיאור קצר של מה נוקה. בקשה לפני ניקוי נכשלת ומאריכה את תקופת הסימון.
  4. גוגל בודקת בדרך כלל תוך 1-3 ימים ומסירה את האזהרה.
- **לא ללחוץ "בקשה לבדיקה" עד שהמתכנת מאשר בכתב שהניקוי הושלם.**


## עדכון 23/10/2026 (רקון מפעיל כרום, קריאה בלבד)
- עדיין פעילים: Custom Fields Pro (Dev Squad), Attention Toolkit (Attention Creative), Archive Title Fix (Maple Digital).
- **חדש/חזר:** Integrity Scanner, תיקיית `integrity-scanner-24`, מחבר "Secure Solutions" - אותו דפוס שם מספרי כמו `custom-fields-pro-169`. ב-13/10 דווח שהוסר; ב-23/10 פעיל שוב → מנגנון התקנה מחדש פעיל (mu-plugins / cron / backdoor).
- **WPCode Lite נעלם** (לא פעיל ולא מותקן). החזיק את סכמת LocalBusiness הגלובלית (שוחזרה דרך Elementor Custom Code 4721). לברר מי הסיר. אם לא המתכנת/NY - הסרת תוספים ע"י גורם זר.
- GSC "דפים מטעים" עדיין מסומן. 6 שבועות מאז הזיהוי.
- רשימת הצעדים למתכנת (10 צעדים) בתוקף; להוסיף: בדיקת integrity-scanner-24, חיפוש מנגנון ההתקנה החוזרת (wp-cron events, mu-plugins, קבצי PHP ב-uploads), ושחזור תוספים שהוסרו ללא ידיעה.

## ✅ 28/10/2026 - ניקוי והקשחה בוצעו (דוח Manta Web, גבי שניידר, 13 עמודים)
**נוקה:** 3 תוספים מזויפים (custom-fields-pro-169, integrity-scanner-24, archive-title-fix) נמחקו; sys_maint (ID 9) נמחק; קוד מוזרק `quick_create()` ב-functions.php של ערכת האם (Hello Elementor) → ערכת האם הוחלפה בעותק נקי 3.4.9; 306 קבצי JS/HTML נגועים (חתימות SMW-INJ-2041082/2037677, quickdelivr + EtherHiding) נוקו ע"י Imunify360; mu-plugins ריקה; drop-ins תקינים; uploads נקי; wp-config/.htaccess/wp-salt ללא הזרקה; Salts הוחלפו; סיסמאות מנהלים/SFTP/DB הוחלפו (DB: שוב, כי נחשפה בקוד המחשבון); Imunify360: No Malware Found. Attention Toolkit סווג כתוסף לגיטימי של הסוכנות שבנתה את האתר (Attention Creative), הוסר כי לא מתוחזק. **הסיבה שהניקוי הקודם נכשל:** ניקוי קבצים בלי החלפת ערכת האם.
**הוקשח:** Cloudflare (Full strict, HSTS, TLS≥1.2, WAF: xmlrpc, wp-login, PHP ב-uploads, wp-config, .env, .git; rate-limit 6/10s; Always HTTPS); שרת (Let's Encrypt, Imunify360 יומי, SSH סגור, SFTP חדש, cron שרת כל 5 דק'); wp-config (DISALLOW_FILE_EDIT, WP_DEBUG_DISPLAY false, Salts, שאריות הוסרו); .htaccess (xmlrpc, קבצי תצורה/גיבוי, כותרות אבטחה); **MU plugin "MantaWeb Hardening"** (wp-admin + התחברות לפי רשימת IP מורשים, עוגיית IP, הגבלת מנהלים לרשימה סגורה, ניטור תוספים/ערכות/wp-content במייל, חסימת התקנת תוספים מהממשק, חסימת wp-json users/XML-RPC/App Passwords); התחברות: Two Factor + WPS Hide Login (כתובת מוסתרת), מנהל חדש gabi_matzberim. **נוהל חירום:** mantaweb-hardening.php → .off ב-SFTP.
**שינויים שמשפיעים עלינו:** `/dev/api.php` נכתב מחדש (GET בלבד, בלי CORS, בלי סיסמה בקובץ, ולידציה, prepare) - המחשבון + ווידג'ט הקישור לעמוד הדגם עובדים (איור 13); `/wp-json/wp/v2/users` 404; עמוד "אודות" תוקן (אימוג'י 620px, Additional CSS גלובלי); **Elementor save לא מנקה Varnish** - רק Breeze → Settings → Varnish → Purge. 246 עמודים נבדקו 200 בדסקטופ ומובייל.
**פתוח אצל המתכנת (מהדוח):** החלפת DB password נוספת (מיידי); בירור admin_email dev@attention.co.il; 2FA לכל המנהלים; Breeze/Varnish; ניטור 2-3 שבועות; WP_DEBUG false; Bing WMT אחרי הסרת הסימון; חוק הגנת הפרטיות (דיווח); /dev/index.html טוען תמונה מכתובת staging; CSP אופציונלי.
**לא בדוח (לבקש):** robots.txt (nocache, api.php, Allow לסורקי AI); אישור ש-Cloudflare לא חוסם GPTBot/PerplexityBot/ClaudeBot/bingbot; הפניית /review; תוסף קאש אחד (WP Rocket/WP Fastest Cache נמחקו?); WPCode - מי הסיר; WP File Manager נמחק?
**הבא אצלנו:** אימות אנונימי מקיף מכרום (IOC, נכסים שלנו, מדידה) → "בקשה לבדיקה" ב-GSC → Bing.

## 5/11/2026 - תשובת המתכנת (Manta Web) ל-12 הסעיפים + ממצאים חדשים
- **Attention Toolkit:** הוסר ב-28/10 והוחזר בהתייעצות עם "אבי" (NY?) כחלק מההקמה המקורית. מעצב מסך התחברות (CSS+JS בלי שליחה החוצה) **אבל כולל מנגנון עדכון משרת חיצוני** (כרגע לא מתחבר) = דלת לקוד עתידי. המלצת המתכנת: להסיר אם לא בשימוש. **ממתין להחלטת בעלים.**
- admin_email → gabi@manta-web.co.il (הודעות מערכת; איפוסי סיסמה הולכים למייל של כל משתמש).
- **WPCode:** לא הם הסירו. הותקן 03/12/2025 ע"י matzberimil; עוד היה ב-16/08 (Wordfence); נעלם בין 16/08 ל-23/10, **אין רישום מי הסיר** → כנראה התוקף. הבלוק וה-hreflang עדיין שמורים ב-DB (לא פעילים).
- **WP File Manager:** המתכנת מחק 28/10. היה בשרת לפחות מ-28/07; החשבון matzberimil (ID 10) פתח אותו לפחות פעם אחת → אם לא הבעלים, מישהו השתמש בחשבון. שאריות DB נמחקו.
- קאש: Breeze בלבד, מכוון.
- **סורקי AI: בוצע.** Cloudflare היה Allow; **החסימה הייתה ברמת שרת Cloudways (403 ל-ClaudeBot)** והוסרה דרך התמיכה. מבחוץ: ClaudeBot, Claude-SearchBot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Google-Extended, bingbot = 200 על llms.txt ודף הבית.
- **robots.txt הועלה** לפי הנוסח שלנו. **/review → 301** לקישור הביקורות בגוגל (עם/בלי www). DB password הוחלפה 28/10.
- נוהל IP: מסך "בקש גישה" → אישור ע"י גבי/NY; 2 IPv4 + טווח IPv6 של הבעלים מאושרים.
- **2FA: רק גבי. matzberimil ו-NY.media עדיין לא** → פרופיל → Two-Factor Options → Authenticator App + Backup Codes.
- WP_DEBUG יכובה 18/11. Bing: אנחנו, אחרי הסרת הסימון.
- **🚨 ממצא חדש 13, וקטור הפריצה הסביר:** בתיקיית /dev היו `api.php.bak` ו-`admin_api.php.bak` (12/06/2026) **נגישים לכולם בלי הרשאה**, עם סיסמת ה-DB בטקסט גלוי וטוקן של `admin_api.php` שאפשר קריאה/שינוי של **כל טבלה ב-DB כולל משתמשים**. ההתחברות הזדונית הראשונה: 26/06, שבועיים אחרי. נמחקו; הסיסמה כבר הוחלפה; ממשק הניהול נכתב מחדש: `/dev/admin.php` (במקום admin.html), דורש התחברות כמנהל (IP+2FA), ללא טוקן, 4 טבלאות בלבד, יומן שינויים. api.php הציבורי תקין.
- **ציר זמן 14:** 26/06 "Tsahi" התחבר מארה"ב + ניסיונות sys_maint/wphadm/seobackup; 04/07 Tsahi שוב מ-IP ברשימת IOC; 12/07-13/08 sys_maint התחבר 13 פעמים (גם אחרי ניקוי 28/07); 16/08 Wordfence זיהה 4 תוספים מזויפים נוספים (backup-reminder-c, booking-form-helper, category-order-easy, changelog-notifier) - כולם לא קיימים היום.
- ניקיונות 15: שאריות DB (_wp_ip_id, _sys_integrity_created), שאריות WP File Manager ותוסף MCP ישן, גיבויי UpdraftPlus יוני-יולי עם לידים הוסרו מהשרת.
- **מוכן ל"בקשה לבדיקה" ב-GSC** ברגע שהבעלים מחליט על Attention Toolkit.
- **5/11, הבעלים:** "Tsahi" = המקדם הקודם של האתר, עבד לפעמים מחו"ל (מסביר התחברויות מארה"ב 26/06 ו-04/07). הבעלים ביקש מהמתכנת להסיר גם את החשבון שלו. הערה: ההתחברות של 04/07 הייתה מ-IP שברשימת ה-IOC, ובאותו ערב (26/06) היו ניסיונות sys_maint/wphadm/seobackup - ייתכן שהמחשב של צחי היה נגוע (ClickFix ביולי) או שהסיסמה שלו דלפה. לכן: הסרת החשבון + ודא שאין לו גישת SFTP/Cloudways/Cloudflare/GSC/GBP/GTM (!).
- **5/11, הבעלים: גם חשבון Google Ads נפרץ** - הופעל קמפיין לא מורשה על כרטיס האשראי שלו (הכרטיס היה מבוטל קודם, לא נגרם חיוב). לא ידוע באיזה חשבון Ads (של מצבר הדרך או האחר) ומתי. נכנס לסריקת Ads: היסטוריית שינויים, משתמשים, MCC, אמצעי תשלום, קמפיינים זרים. משתמעת פריצה לחשבון Google עצמו (סיסמה/סשן) → להחליף סיסמת Google + 2FA + בדיקת "מכשירים מחוברים" ו"אפליקציות עם גישה" בחשבון Google.

## 5/11/2026 - ביקורת נכסי גוגל: הפריצה ל-Google Ads (מפעיל כרום, קריאה בלבד)
- **חשבון Ads של מצבר הדרך: 257-112-5223** (תג AW-16672640254, GT-NNSCT9T6), בחשבון גוגל **matzberim.h@gmail.com**, נפתח 14/8/2024 ע"י get@attention.co.il. מודעות לא מוצגות בגלל חוב.
- **הפריצה: 15/5/2026 19:06-19:11, מתוך המשתמש matzberim.h@gmail.com עצמו** (= חשבון גוגל נפרץ, לא משתמש זר ב-Ads). נוצר "Campaign #1": תקציב **5,500 ₪/יום**, רשת חיפוש, 43 מילות מפתח "Bing Webmaster / SEO", URLs דרך bing.com/ck ל-ader.naver.com (הונאת affiliate), קבוצת מודעות בפורטוגזית; הושהו נכס השיחה והלוגו. **156 קליקים, 1,501.65 ₪** ב-15-16/5: ניצל קרדיט 900 ₪, 3 ניסיונות חיוב על MC 1081 (3,500/350/500 ₪) נדחו, **חוב 610.67 ₪**. **הקמפיין עדיין "כשיר"** - יחזור לרוץ אם החוב יוסדר.
- **משתמשים ב-Ads:** matzberim.h (אדמין), **get@attention.co.il (אדמין, כניסה אחרונה 29/12/2025)**, ny.media (אדמין), **artgor.com@gmail.com (אדמין, נוסף 29/6/2025 ע"י matzberim.h, נכנס היום 5/11/2026!)**. MCC: NY Media 310-204-0367 בלבד. דומיינים מותרים: **attention.co.il**, gmail.com. 2FA חובה מופעל.
- **פרופיל תשלומים 8965-5386-0189:** ארגון "רבקה סהלו", יצחק בן צבי 33 חדרה, איש קשר "Attention Creative", משתמש יחיד get@attention.co.il. אמצעי תשלום ראשי **MC 8775** (לא מזוהה), MC 1081 "נדחה".
- המרות: Calls from ads, שיחת טלפון מהאתר (תג), WhatsApp (תג) ראשיות; אין ייבוא click2call מ-GA4. **GA4 מקושר: נכס "arizon" 271782627 (לא הנכס שלנו 471722629!)** דרך MCC NY 27/12/2023.
- **חשבונות גוגל:** matzberim.h: 2FA, 2 passkeys (מי הוסיף? לבדוק תאריכים), סיסמה שונתה 8/7 (אחרי הפריצה במאי), אפליקציות: base44, Cloudflare, Cloudways, **Did.Li, Tiiny Host** (לא מוכרים), shein. shlomochana22: **סיסמה מ-2017**, אימייל שחזור **chillbateva@gmail.com לא מאומת**, 2 מכשירים "לא ידועים" (טלוויזיה, iPhone), 30 אפליקציות. רשימת מכשירים מלאה דורשת סיסמה (הבעלים).
- **GSC:** shlomochana22 משתמש בלבד ב-2 נכסי URL-prefix (matzberimil.co.il, car-battery.co.il), נכסי Domain בבעלות לא ידועה. **TXT לאימות Domain (shlomochana22):** `google-site-verification=cbZqzy5rmbM6Fa7SMVFJ1G4ZSqLHHdDrSRtO7k0fJ4Q` → לגבי (DNS ב-Cloudflare).
- **GBP:** "מצבר הדרך": בעלים ראשי matzberim.h, מנהל shlomochana22; "מצברי רחובות": בעלים shlomochana22. אין זרים.
- **GTM:** אין גישה לאף חשבון. בדף הבית: GTM-KZ95TD6X, GT-KF63F2DJ, G-TRHCLLYZF1, AW-16672640254.
- **המלצות הסרה (ממתינות לבעלים):** Campaign #1 (להסיר לפני הסדרת חוב), artgor.com@gmail.com, get@attention.co.il, attention.co.il מדומיינים מותרים, get@attention מפרופיל התשלומים (אחרי הוספת הבעלים), MC 8775 אם לא מוכר.
- **5/11, בעלים:** artgor.com@gmail.com **לא מוכר** → להסיר (אדמין זר שנכנס היום). "רבקה סהלו" = אשתו של הבעלים (פרופיל התשלומים לגיטימי, הכרטיס שלה); נשאר. להסיר מפרופיל התשלומים רק את get@attention.co.il אחרי הוספת הבעלים.
